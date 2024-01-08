import { client } from './client';

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) => v.endpoint.includes('nodereal'));

  return finalSps;
};

export const getRandomSp = async () => {
  const finalSps = await getSps();

  const selectIndex = Math.floor(Math.random() * finalSps.length);

  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    id: finalSps[selectIndex].id,
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };

  return selectSpInfo;
};
