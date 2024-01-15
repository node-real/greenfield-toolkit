import { TTmpAccount } from '@/components/UploadProvider/types';
import { ErrorResponse, commonFault, createTxFault } from './error';
import {
  GRNToString,
  MsgCreateObjectTypeUrl,
  PermissionTypes,
  newBucketGRN,
  TxResponse,
  Client,
  Long,
} from '@bnb-chain/greenfield-js-sdk';
import { Wallet } from '@ethersproject/wallet';
import { parseEther } from 'viem';
import { resolve } from './common';
import { toTimestamp } from '@/utils/object';
import { BN } from '@/utils/math';
import { CRYPTOCURRENCY_DISPLAY_PRECISION } from '@/constants';
import { getTimestampInSeconds } from '@/utils/time';

export interface getCreateTmpAccountTxParams {
  address: string;
  bucketName: string;
  amount: number;
  client: Client;
}

export const getCreateTmpAccountTx = async ({
  address,
  bucketName,
  amount,
  client,
}: getCreateTmpAccountTxParams): Promise<
  | ErrorResponse
  | [
      {
        txs: TxResponse[];
        tmpAccount: TTmpAccount;
      },
      null,
    ]
> => {
  //messages and resources are different for create and delete

  const grantAllowedMessage = [MsgCreateObjectTypeUrl];
  const statementAction = [PermissionTypes.ActionType.ACTION_CREATE_OBJECT];

  // 1. create temporary account
  const wallet = Wallet.createRandom();

  // 2. allow temporary account to submit specified tx and amount
  const curTimeStamp = +new Date();
  const expirationTimestamp = Math.floor(curTimeStamp + 10 * 60 * 60 * 1000);
  const expirationDate = new Date(expirationTimestamp);
  const [grantAllowanceTx, allowError] = await client.feegrant
    .grantAllowance({
      granter: address,
      grantee: wallet.address,
      allowedMessages: grantAllowedMessage,
      amount: parseEther(amount <= 0 ? '0.1' : String(amount)).toString(),
      denom: 'BNB',
      expirationTime: toTimestamp(expirationDate),
    })
    .then(resolve, createTxFault);

  if (allowError) return [null, allowError];

  const resources = [GRNToString(newBucketGRN(bucketName))];

  // 3. Put bucket policy so that the temporary account can create objects within this bucket
  const statement: PermissionTypes.Statement = {
    effect: PermissionTypes.Effect.EFFECT_ALLOW,
    actions: statementAction,
    resources: resources,
  };

  const [putPolicyTx, createTxError] = await client.bucket
    .putBucketPolicy(bucketName, {
      operator: address,
      statements: [statement],
      principal: {
        type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
        value: wallet.address,
      },
    })
    .then(resolve, createTxFault);

  if (createTxError) return [null, createTxError];

  const data = {
    txs: [grantAllowanceTx!, putPolicyTx!],
    tmpAccount: {
      address: wallet.address,
      privateKey: wallet.privateKey,
    },
  };

  return [data, null];
};

export const getStoreFeeParams = async (client: Client) => {
  const now = getTimestampInSeconds();
  const [globalSpStoragePrice, { params: storageParams }, { params: paymentParams }] =
    await Promise.all([
      client.sp.getQueryGlobalSpStorePriceByTime({ timestamp: Long.fromNumber(now) }),
      client.storage.params(),
      client.payment.params(),
    ]);

  const {
    minChargeSize = new Long(0),
    redundantDataChunkNum = 0,
    redundantParityChunkNum = 0,
  } = (storageParams && storageParams.versionedParams) || {};

  const { reserveTime, validatorTaxRate } = paymentParams?.versionedParams || {};
  const storeFeeParamsPayload = {
    primarySpStorePrice: globalSpStoragePrice?.globalSpStorePrice.primaryStorePrice || '',
    readPrice: globalSpStoragePrice?.globalSpStorePrice.readPrice || '',
    secondarySpStorePrice: globalSpStoragePrice?.globalSpStorePrice.secondaryStorePrice || '',
    validatorTaxRate: validatorTaxRate || '',
    minChargeSize: minChargeSize.toNumber(),
    redundantDataChunkNum,
    redundantParityChunkNum,
    reserveTime: reserveTime?.toString() || '',
  };

  return storeFeeParamsPayload;
};

export const getSettlementFee = async (address: string, client: Client) => {
  const [res, error] = await client.payment.getStreamRecord(address).then(resolve, commonFault);
  if (!res || error) return [null, error];
  const { streamRecord } = res;
  const curTime = Math.floor(+new Date() / 1000);
  const storedTime = curTime - Number(streamRecord.crudTimestamp.low);
  const amount = BN(streamRecord.netflowRate)
    .dividedBy(10 ** 18)
    .times(storedTime)
    .dp(CRYPTOCURRENCY_DISPLAY_PRECISION)
    .abs()
    .toString();

  return [amount, null];
};
