import { getBucketMeta } from '@/facade/bucket';
import { Client } from '@bnb-chain/greenfield-js-sdk';

const getRandomString = (length: number): string => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)],
  ).join('');
};

export const getRandomBucketName = () => {
  return `bucket-${getRandomString(8)}`;
};

export const bucketIsExist = async (
  options: { bucketName: string; endpoint: string },
  client: Client,
) => {
  const [exist, error] = await getBucketMeta(options, client);

  if (!exist || error) {
    return false;
  }
  return true;
};
