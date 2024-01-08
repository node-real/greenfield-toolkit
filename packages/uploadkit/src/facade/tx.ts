import { TxResponse } from '@bnb-chain/greenfield-js-sdk';
import { ErrorResponse, UNKNOWN_ERROR, broadcastFault, simulateFault } from './error';
import { Client } from '@bnb-chain/greenfield-js-sdk';
import { DeliverResponse, resolve } from './common';
import { signTypedDataCallback } from './wallet';
import { TTmpAccount } from '@/components/UploadProvider/types';

/**
 * ECDSA Signature
 */
export type ECDSA = {
  type: 'ECDSA';
  privateKey: string;
};
/**
 * EDDSA Signature
 */
export type EDDSA = {
  type: 'EDDSA';
  seed: string;
  domain: string;
  address: string;
};
export type AuthType = ECDSA | EDDSA;

export const broadcastMulTxs = async ({
  txs,
  address,
  client,
  connector,
}: {
  txs: TxResponse[];
  address: `0x${string}`;
  client: Client;
  connector: any;
}): Promise<ErrorResponse | [boolean, null]> => {
  const multiTxs = await client.txClient.multiTx(txs);
  const [simulateInfo, simulateError] = await multiTxs
    .simulate({
      denom: 'BNB',
    })
    .then(resolve, simulateFault);

  if (simulateInfo === null || simulateError) return [null, simulateError];

  const payload = {
    denom: 'BNB',
    gasLimit: Number(simulateInfo.gasLimit),
    gasPrice: simulateInfo.gasPrice,
    payer: address,
    granter: '',
    signTypedDataCallback: signTypedDataCallback(connector),
  };
  const [res, error] = await multiTxs.broadcast(payload).then(resolve, broadcastFault);

  if ((res && res.code !== 0) || error) {
    return [null, error || UNKNOWN_ERROR];
  }

  return [true, null];
};

export const broadcastTmpTx = async (
  tx: TxResponse,
  tmpAccount: TTmpAccount,
  address: `0x${string}`,
): Promise<ErrorResponse | [DeliverResponse, null]> => {
  if (!tx) {
    return [null, 'tx is null'];
  }
  const [simulateInfo, simulateError] = await tx
    .simulate({
      denom: 'BNB',
    })
    .then(resolve, simulateFault);
  if (simulateInfo === null || simulateError) return [null, simulateError];
  const broadcastPayload = {
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: tmpAccount.address,
    granter: address,
    privateKey: tmpAccount.privateKey,
  };

  const [res, error] = await tx.broadcast(broadcastPayload).then(resolve, broadcastFault);

  if (!res || (res && res.code !== 0) || error) {
    return [null, error || UNKNOWN_ERROR];
  }

  return [res, error];
};

export const broadcastTx = async (
  tx: TxResponse,
  address: `0x${string}`,
  connector: any,
): Promise<ErrorResponse | [DeliverResponse, null]> => {
  if (!tx) {
    return [null, 'tx is null'];
  }
  const [simulateInfo, simulateError] = await tx
    .simulate({
      denom: 'BNB',
    })
    .then(resolve, simulateFault);
  if (simulateInfo === null || simulateError) return [null, simulateError];
  const broadcastPayload = {
    denom: 'BNB',
    gasLimit: Number(simulateInfo?.gasLimit),
    gasPrice: simulateInfo?.gasPrice || '5000000000',
    payer: address,
    granter: '',
    signTypedDataCallback: signTypedDataCallback(connector),
  };

  const [res, error] = await tx.broadcast(broadcastPayload).then(resolve, broadcastFault);

  if (!res || (res && res.code !== 0) || error) {
    return [null, error || UNKNOWN_ERROR];
  }

  return [res, error];
};
