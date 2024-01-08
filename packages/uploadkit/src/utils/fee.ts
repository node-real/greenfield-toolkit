import { StoreParams } from '@/components/FeeProvider/context';
import { BN } from './math';

export const getStoreNetflowRate = (size: number, storeFeeParams: StoreParams) => {
  const {
    primarySpStorePrice,
    secondarySpStorePrice,
    redundantDataChunkNum,
    redundantParityChunkNum,
    minChargeSize,
    validatorTaxRate,
  } = storeFeeParams;
  const chargeSize = size >= minChargeSize ? size : minChargeSize;
  const primarySpRate = BN(primarySpStorePrice).dividedBy(Math.pow(10, 18)).times(BN(chargeSize));
  const secondarySpNum = redundantDataChunkNum + redundantParityChunkNum;
  let secondarySpRate = BN(secondarySpStorePrice).dividedBy(Math.pow(10, 18)).times(BN(chargeSize));
  secondarySpRate = secondarySpRate.times(secondarySpNum);
  const validatorTax = BN(validatorTaxRate)
    .dividedBy(Math.pow(10, 18))
    .times(primarySpRate.plus(secondarySpRate));
  const netflowRate = primarySpRate.plus(secondarySpRate).plus(validatorTax);

  return netflowRate.toString();
};

export const getQuotaNetflowRate = (size: number, storeFeeParams: StoreParams) => {
  const { validatorTaxRate, readPrice } = storeFeeParams;
  const primaryQuotaRate = BN(readPrice)
    .dividedBy(10 ** 18)
    .times(size);
  const taxRate = BN(validatorTaxRate)
    .dividedBy(10 ** 18)
    .times(primaryQuotaRate);
  return primaryQuotaRate.plus(taxRate).toString();
};
