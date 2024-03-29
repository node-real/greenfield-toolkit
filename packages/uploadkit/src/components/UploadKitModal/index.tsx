import { Modal } from '@/base/components/Modal';
import { useIsMounted } from '@/base/hooks/useIsMounted';
import { useModal } from '../ModalProvider/context';
import { useRouter } from '../RouteProvider/context';

export function UploadKitModal() {
  const { isOpen, onClose, closeOnEsc, closeOnOverlayClick } = useModal();
  const { page } = useRouter();
  const isMounted = useIsMounted();
  const { isClosable } = useModal();

  if (!isMounted) return null;

  return (
    <Modal
      className="uk-connect-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={isClosable ? closeOnEsc : false}
      closeOnOverlayClick={isClosable ? closeOnOverlayClick : false}
    >
      {page}
    </Modal>
  );
}
