import { useUpload } from '@/components/UploadProvider';

/**
 * useUploadQueue for get the upload queue data.
 */
export const useUploadQueue = () => {
  const {
    state: { uploadQueue },
  } = useUpload();

  return {
    uploadQueue,
  };
};
