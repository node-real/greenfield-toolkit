import { useUploadKitContext } from '@/components/UploadKitProvider/context';
import { getSettlementFee } from '@/facade/payment';
import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';

export const useSettlementFee = (address: string) => {
  const [settlementFee, setSettlementFee] = useState('-1');
  const {
    options: { client },
  } = useUploadKitContext();
  useAsyncEffect(async () => {
    if (!address) return;

    const [fee, error] = await getSettlementFee(address, client);
    error ? setSettlementFee('0') : setSettlementFee(fee as string);
  }, [address]);

  return {
    loading: settlementFee === '-1',
    settlementFee,
  };
};
