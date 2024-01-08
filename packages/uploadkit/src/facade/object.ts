import {
  CreateObjectApprovalRequest,
  Client,
  METHOD_PUT,
  SpMetaInfo,
  isValidBucketName,
  isValidObjectName,
  PutObjectRequest,
} from '@bnb-chain/greenfield-js-sdk';
import { resolve } from './common';
import { ErrorResponse, createTxFault } from './error';
import { AuthType } from '@/facade/tx';

export const getCreateObjectTx = async (
  configParam: CreateObjectApprovalRequest,
  authType: AuthType,
  client: Client,
) => {
  return client.object.createObject(configParam, authType).then(resolve, createTxFault);
};

export type TMakePutObjectHeaders = PutObjectRequest & {
  endpoint: string;
};

export const makePutObjectHeaders = async (
  configParam: TMakePutObjectHeaders,
  authType: AuthType,
  client: Client,
): Promise<
  ErrorResponse | [{ url: string; headers: Headers; method: string; params: URLSearchParams }, null]
> => {
  const { bucketName, objectName, txnHash, body, endpoint } = configParam;
  if (!isValidBucketName(bucketName)) {
    return [null, 'Error bucket name'];
  }
  if (!isValidObjectName(objectName)) {
    return [null, 'Error object name'];
  }
  if (!txnHash) {
    return [null, 'Transaction hash is empty, please check.'];
  }
  const method = METHOD_PUT;
  const params = new URLSearchParams();
  const payload = {
    objectName,
    bucketName,
    txnHash,
    contentType: body.type || 'text/plain',
    body,
  };
  const { reqMeta, url } = await SpMetaInfo.getPutObjectMetaInfo(endpoint, payload);
  const headers = await client.spClient.signHeaders(reqMeta, authType);

  return [
    {
      url,
      headers,
      method,
      params,
    },
    null,
  ];
};
