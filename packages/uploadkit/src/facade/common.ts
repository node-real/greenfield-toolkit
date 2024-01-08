import { TxResponse } from '@bnb-chain/greenfield-js-sdk';
import { ErrorResponse } from './error';
import { Client } from '@bnb-chain/greenfield-js-sdk';

export const resolve = <R>(r: R): [R, null] => [r, null];

export type DeliverResponse = Awaited<ReturnType<TxResponse['broadcast']>>;

export type BroadcastResponse = Promise<ErrorResponse | [DeliverResponse, null]>;

export const uploadRequest = ({
  url,
  file,
  headers,
  onProgress,
}: {
  url: string;
  file: File;
  headers: Headers;
  onProgress: (progress: number) => void;
}) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', (e) => onProgress(e.loaded / e.total));
    xhr.addEventListener('load', () => resolve({ status: xhr.status, body: xhr.responseText }));
    xhr.addEventListener('error', () => reject(new Error('File upload failed')));
    xhr.addEventListener('abort', () => reject(new Error('File upload aborted')));
    xhr.open('PUT', url, true);

    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    const formData = new FormData();
    formData.append('file', file);
    xhr.send(formData);
  });
