import { toast } from '@/base/components/toast';
import { UploadKitOptions } from '..';

export const RECOMMEND_MAX_OBJECT_SIZE = 56 * 1024 * 1024;
export const RECOMMEND_MAX_OBJECT_COUNT = 100;

export function getDefaultProviderOptions(options: UploadKitOptions) {
  const { ...restOptions } = options;

  const mergedOptions: UploadKitOptions = {
    maxObjectSize: RECOMMEND_MAX_OBJECT_SIZE,
    maxObjectCount: RECOMMEND_MAX_OBJECT_COUNT,

    visibility: 'VISIBILITY_TYPE_PUBLIC_READ',

    taskManagementButton: true,

    closeModalOnEsc: true,
    closeModalOnOverlayClick: true,

    onError,
    ...restOptions,
  };

  return mergedOptions;
}

function onError(errorMsg: string) {
  if (errorMsg) {
    toast.error({
      description: errorMsg,
    });
  }
}
