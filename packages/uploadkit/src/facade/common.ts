import { TxResponse } from '@bnb-chain/greenfield-js-sdk';
import { ErrorResponse } from './error';

export const resolve = <R>(r: R): [R, null] => [r, null];

export type DeliverTxResponse = Awaited<ReturnType<TxResponse['broadcast']>>;

export type BroadcastResponse = Promise<ErrorResponse | [DeliverTxResponse, null]>;
