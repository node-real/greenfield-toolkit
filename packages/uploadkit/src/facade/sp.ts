import { Client } from '@bnb-chain/greenfield-js-sdk';
import { resolve } from './common';
import { ErrorResponse, commonFault } from './error';
import { StorageProvider } from '@bnb-chain/greenfield-cosmos-types/greenfield/sp/types';

export const getSps = async (
  client: Client,
): Promise<ErrorResponse | [StorageProvider[], null]> => {
  const [sps, error] = await client.sp.getStorageProviders().then(resolve, commonFault);
  if (sps === null || error) {
    return [null, error];
  }
  const finalSps = (sps ?? []).filter((sp) => sp.endpoint.startsWith('https'));

  return [finalSps, null];
};

export const getNonce = async ({
  spEndpoint,
  userAddress,
  spName,
  domain,
}: {
  spEndpoint: string;
  userAddress: string;
  spName: string;
  domain: string;
}) => {
  const url = `${spEndpoint}/auth/request_nonce`;
  const headers = new Headers({
    'X-Gnfd-User-Address': userAddress,
    'X-Gnfd-App-Domain': domain,
  });
  try {
    const result = await fetch(url, {
      headers,
    });
    if (!result.ok) {
      return [null, `${spName} not available!`];
    }

    return [true, null];
  } catch (error) {
    return [null, `${spName} not available!`];
  }
};
