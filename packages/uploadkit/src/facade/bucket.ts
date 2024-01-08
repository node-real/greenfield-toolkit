import { BroadcastResponse, resolve } from './common';
import { ErrorResponse, broadcastFault, createTxFault, simulateFault } from './error';
import {
  Client,
  CreateBucketApprovalRequest,
  ISimulateGasFee,
  TxResponse,
} from '@bnb-chain/greenfield-js-sdk';
import { Connector } from 'wagmi';
import { signTypedDataCallback } from './wallet';
import { AuthType } from '@/facade/tx';
import { commonFault } from './error';

export const simulateCreateBucket = async (
  params: CreateBucketApprovalRequest,
  authType: AuthType,
  client: Client,
): Promise<[ISimulateGasFee, null, TxResponse] | ErrorResponse> => {
  const [createBucketTx, error1] = await client.bucket
    .createBucket(params, authType)
    .then(resolve, createTxFault);

  if (!createBucketTx) return [null, error1];

  const [simulateInfo, error2] = await createBucketTx
    .simulate({
      denom: 'BNB',
    })
    .then(resolve, simulateFault);

  if (!simulateInfo) return [null, error2];

  return [simulateInfo, null, createBucketTx];
};

export const createBucket = async (
  params: CreateBucketApprovalRequest,
  authType: AuthType,
  connector: Connector,
  client: Client,
): BroadcastResponse => {
  const [simulateInfo, error, createBucketTx] = await simulateCreateBucket(
    params,
    authType,
    client,
  );
  if (!simulateInfo) return [null, error];

  const payload = {
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: params.creator,
    granter: '',
    signTypedDataCallback: signTypedDataCallback(connector),
  };

  return createBucketTx.broadcast(payload).then(resolve, broadcastFault);
};

export const getCreateBucketTx = async (
  params: CreateBucketApprovalRequest,
  authType: AuthType,
  client: Client,
): Promise<[TxResponse, null] | ErrorResponse> => {
  return client.bucket.createBucket(params, authType).then(resolve, createTxFault);
};

export const getBucketMeta = (
  options: { bucketName: string; endpoint: string },
  client: Client,
) => {
  return client.bucket.getBucketMeta(options).then(resolve, commonFault);
};
