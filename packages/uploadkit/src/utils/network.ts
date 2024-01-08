import { gnfdChainIds } from '@/constants';

export const isGnfdChain = (chainId?: number) => {
  if (!chainId) return false;
  return gnfdChainIds.includes(chainId);
};
