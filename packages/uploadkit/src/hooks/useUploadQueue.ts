import { useUpload } from '@/components/UploadProvider';

export const useUploadQueue = () => {
  const {
    state: { uploadQueue },
  } = useUpload();

  return {
    uploadQueue,
  };
};
