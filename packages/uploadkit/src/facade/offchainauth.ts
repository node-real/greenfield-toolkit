import { Client, IReturnOffChainAuthKeyPairAndUpload } from '@bnb-chain/greenfield-js-sdk';
import { getSps } from './sp';
import { ErrorResponse, UNKNOWN_ERROR } from './error';

export const OFF_CHAIN_AUTH_EXPIRATION_MS = 5 * 24 * 60 * 60 * 1000;
export const getOffChainAuthKeys = async ({
  address,
  provider,
  client,
  chainId,
}: {
  address: string;
  chainId: number;
  provider: any;
  client: Client;
}): Promise<ErrorResponse | [IReturnOffChainAuthKeyPairAndUpload, null]> => {
  const [allSps, error] = await getSps(client);
  if (allSps === null || error) {
    return [null, error];
  }
  const sps = allSps.map((sp) => ({
    address: sp.operatorAddress,
    endpoint: sp.endpoint,
    name: sp.description?.moniker,
  }));
  const offchainAuthRes = await client.offchainauth.genOffChainAuthKeyPairAndUpload(
    {
      sps: sps,
      chainId: chainId,
      expirationMs: OFF_CHAIN_AUTH_EXPIRATION_MS,
      domain: window.location.origin,
      address,
    },
    provider,
  );

  const { code, body: offChainData } = offchainAuthRes;
  if (code !== 0 || !offChainData) {
    return [null, offchainAuthRes.message || UNKNOWN_ERROR];
  }

  return [offChainData, null];
};
