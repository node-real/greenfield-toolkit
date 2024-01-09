import { createContext, useContext } from 'react';
import { Client } from '@bnb-chain/greenfield-js-sdk';
import { Sp } from '@/components/UploadProvider/types';
import { VisibilityType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

/**
 * UploadKitOptions is the options of the Greenfield UploadKit.
 *
 * @property {Client} client - THe Greenfield js sdk client, Reference: https://docs.bnbchain.org/greenfield-js-sdk/client/greenfield-client
 *
 * @property {string} seedString -seedString is used to authenticate yourself to the provider. If not specified, the provider will generate one.
 * @property {(data: Uint8Array) => Promise<string[]>} [checksumFn] - The function to calculate the checksum of the object. If not specified, the provider will use the default checksum function.
 *
 * @property {string} [bucketName] - The name of the bucket. If not specified, the default bucket will be used.
 * @property {Sp} [sp] - The storage service provider. If not specified, a random one will be selected.
 * @property {keyof typeof VisibilityType} [visibility='VISIBILITY_TYPE_PUBLIC_READ'] - The visibility of the object. If not specified, 'VISIBILITY_TYPE_PUBLIC_READ' will be used.
 *
 * @property {number} [maxObjectSize=56 * 1024 * 1024] - If not specified, the default is set to 56MB, resulting in an encoding time of under 6 seconds. Larger files may experience extended encoding times, and it is recommended to utilize a web worker for encoding large files. Reference: https://github.com/bnb-chain/greenfield-js-sdk/blob/main/packages/reed-solomon/examples/web-worker.html
 * @property {number} [maxObjectCount=100] - The maximum count of objects. If not specified, 100 will be used.
 *
 * @property {boolean} [taskManagementButton=true] - Specifies whether to show the task management button.
 *
 * @property {(errorMsg: string) => void} [onError] - The callback function when an error occurs.
 */
export interface UploadKitOptions {
  client: Client;

  seedString?: string;
  checksumFn?: (data: Uint8Array) => Promise<string[]>;

  bucketName?: string;
  sp?: Sp;
  visibility?: keyof typeof VisibilityType;

  maxObjectSize?: number;
  maxObjectCount?: number;

  taskManagementButton?: boolean;

  closeModalOnEsc?: boolean;
  closeModalOnOverlayClick?: boolean;

  onError?: (errorMsg: string) => void;
}

export interface UploadKitContextProps {
  options: UploadKitOptions;
}

export const UploadKitContext = createContext({} as UploadKitContextProps);

export function useUploadKitContext() {
  const context = useContext(UploadKitContext);
  return context;
}
