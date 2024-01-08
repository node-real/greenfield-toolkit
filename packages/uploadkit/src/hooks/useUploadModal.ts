import { useModal } from '@/components/ModalProvider/context';
import { routes } from '@/components/RouteProvider';
import { useRouter } from '@/components/RouteProvider/context';

export const useUploadModal = () => {
  const router = useRouter();
  const { onOpen, onClose } = useModal();
  const onOpenDragModal = () => {
    router.push(routes.DRAG);
    onOpen();
  };
  const onOpenUploadModal = () => {
    router.push(routes.UPLOAD);
    onOpen();
  };
  const onCloseModal = () => {
    onClose();
  };
  return {
    onOpenDragModal,
    onOpenUploadModal,
    onCloseModal,
  };
};
