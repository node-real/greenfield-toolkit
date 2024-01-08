import { useUpload } from '@/components/UploadProvider';
import { UploadObject } from '@/components/UploadProvider/types';
import { useEffect, useState } from 'react';

export enum UploadQueueStatus {
  EMPTY = 0,
  UPLOADING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

export const useUploadQueueStatus = () => {
  const [status, setStatus] = useState(UploadQueueStatus.EMPTY);
  const {
    state: { uploadQueue },
  } = useUpload();

  useEffect(() => {
    const allStatus = uploadQueue.map((item: UploadObject) => item.status);
    const uniqueStatus = [...new Set(allStatus)] as string[];
    if (uploadQueue.length === 0) {
      return setStatus(UploadQueueStatus.EMPTY);
    }
    if (
      uniqueStatus.some((item: string) =>
        ['WAIT', 'HASH', 'HASHED', 'SIGN', 'SIGNED', 'UPLOAD'].includes(item),
      )
    ) {
      setStatus(UploadQueueStatus.UPLOADING);
    } else if (uniqueStatus.length === 1 && uniqueStatus[0] === 'FINISH') {
      setStatus(UploadQueueStatus.SUCCESS);
    } else {
      setStatus(UploadQueueStatus.FAILED);
    }
  }, [JSON.stringify(uploadQueue)]);

  return status;
};
