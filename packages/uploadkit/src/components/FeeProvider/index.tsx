import { useState } from 'react';
import { FeeContext, GasObjects, StoreParams } from './context';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import { getStoreFeeParams } from '@/facade/payment';
import { useUploadKitContext } from '../UploadKitProvider/context';
import { Long, MsgGrantAllowanceTypeUrl } from '@bnb-chain/greenfield-js-sdk';

export const GAS_PRICE = '0.000000005';

export interface FeeProviderProps {
  children: React.ReactNode;
}

export function FeeProvider(props: FeeProviderProps) {
  const { children } = props;
  const {
    options: { client },
  } = useUploadKitContext();
  const [gasHub, setGasHub] = useState({
    gasPrice: GAS_PRICE,
    gasObjects: {} as GasObjects,
  });
  const [storeParams, setStoreParams] = useState({} as StoreParams);

  useAsyncEffect(async () => {
    const storeFeeParams = await getStoreFeeParams(client);
    setStoreParams(storeFeeParams);
    const { gasPrice } = gasHub;
    const res = await client.gashub.getMsgGasParams({
      msgTypeUrls: [],
      pagination: {
        countTotal: true,
        key: Uint8Array.from([]),
        limit: Long.fromInt(1000),
        offset: Long.fromInt(0),
        reverse: false,
      },
    });

    const tempGasObjects = {} as GasObjects;
    res.msgGasParams.forEach((item) => {
      let gasLimit = item.fixedType?.fixedGas.low || 0;
      let gasFee = +gasPrice * gasLimit;
      let perItemFee = 0;
      if (item.msgTypeUrl === MsgGrantAllowanceTypeUrl) {
        gasLimit = item.grantAllowanceType?.fixedGas.low || 0;
        gasFee = +gasPrice * gasLimit;
        perItemFee = (item.grantAllowanceType?.gasPerItem.low || 0) * +gasPrice;
      }

      tempGasObjects[item.msgTypeUrl] = {
        msgTypeUrl: item.msgTypeUrl,
        gasLimit,
        gasFee,
        perItemFee,
      };
    });
    setGasHub({
      gasPrice: gasPrice,
      gasObjects: tempGasObjects,
    });
  }, []);

  return (
    <FeeContext.Provider
      value={{
        gasHub,
        storeParams,
      }}
    >
      {children}
    </FeeContext.Provider>
  );
}
