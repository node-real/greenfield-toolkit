import React from 'react';

export type GasObjects = {
  [msgTypeUrl: string]: {
    gasLimit: number;
    msgTypeUrl: string;
    gasFee: number;
    perItemFee: number;
  };
};

export type GasHub = {
  gasPrice: string;
  gasObjects: GasObjects;
};

export type StoreParams = {
  readPrice: string;
  primarySpStorePrice: string;
  secondarySpStorePrice: string;
  validatorTaxRate: string;
  minChargeSize: number;
  redundantDataChunkNum: number;
  redundantParityChunkNum: number;
  reserveTime: string;
};
export interface FeeContextProps {
  gasHub: GasHub;
  storeParams: StoreParams;
}

export const FeeContext = React.createContext({} as FeeContextProps);

export function useFee() {
  const context = React.useContext(FeeContext);
  return context;
}
