import { useUpload } from '../UploadProvider';
import { useMemo } from 'react';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import useSingleton from '@/hooks/useSingleton';

import { useAccount } from 'wagmi';
import { useUploadKitContext } from '../UploadKitProvider/context';
import useAsyncEffect from '@/hooks/useAsyncEffect';
import { getHashTask, getSignTask, getUploadTask, processTask, processUploadTasks } from './utils';

export const GlobalTasks = () => {
  const { state, dispatch } = useUpload();
  const { address } = useAccount();
  const { options } = useUploadKitContext();
  const { client, checksumFn } = options;
  const { uploadQueue, tmpAccount, selectedSp, seedString } = state;

  const rs = useSingleton(ReedSolomon);

  const hashTask = useMemo(() => getHashTask(uploadQueue), [uploadQueue]);
  const signTask = useMemo(() => getSignTask(uploadQueue), [uploadQueue]);
  const uploadTask = useMemo(() => getUploadTask(uploadQueue), [uploadQueue]);

  // 1. Hash
  useAsyncEffect(
    async () =>
      processTask({
        task: hashTask,
        status: 'HASH',
        dispatch,
        checksumFn,
        rs,
        tmpAccount,
        client,
        address,
      }),
    [hashTask, dispatch],
  );

  // 2. Sign
  useAsyncEffect(
    async () =>
      processTask({
        task: signTask,
        status: 'SIGN',
        dispatch,
        client,
        rs,
        tmpAccount,
        address,
        checksumFn,
      }),
    [signTask, dispatch],
  );

  // 3. Upload
  useAsyncEffect(
    () =>
      processUploadTasks({
        tasks: uploadTask,
        uploadQueue,
        dispatch,
        seedString,
        client,
        address,
        selectedSp,
      }),
    [uploadTask.join('')],
  );

  return <></>;
};
