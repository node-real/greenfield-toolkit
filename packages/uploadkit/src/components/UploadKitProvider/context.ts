import { createContext, useContext } from 'react';
import { Client } from '@bnb-chain/greenfield-js-sdk';
import { Sp } from '@/components/UploadProvider/types';
import { VisibilityType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';

export interface UploadKitOptions {
  client: Client;
  seedString?: string;
  checksumFn?: (file: File) => Promise<string[]>;

  bucketName?: string;
  sp?: Sp;
  visibility?: keyof typeof VisibilityType;

  maxObjectSize?: number;
  maxObjectCount?: number;

  taskManagementButton?: boolean;

  closeModalAfterConnected?: boolean;
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
