import { useDisclosure } from '@/base/hooks/useDisclosure';
import { useMemo, useState } from 'react';
import { useRouter } from '../RouteProvider/context';
import { useUploadKitContext } from '../UploadKitProvider/context';
import { ModalContext } from './context';
import { useUpload } from '../UploadProvider';

export interface ModalProviderProps {
  children: React.ReactNode;
}

export function ModalProvider(props: ModalProviderProps) {
  const { children } = props;
  const [isClosable, setIsClosable] = useState(true);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { dispatch } = useUpload();
  const router = useRouter();
  const { options } = useUploadKitContext();
  const { closeModalOnEsc, closeModalOnOverlayClick } = options;

  const value = useMemo(() => {
    const onResetWaitQueue = () => {
      dispatch({
        type: 'RESET_WAIT_QUEUE',
      });
    };

    return {
      isClosable,
      closeOnEsc: closeModalOnEsc,
      closeOnOverlayClick: closeModalOnOverlayClick,
      isOpen,
      onClose() {
        onClose();
        setTimeout(() => {
          setIsClosable(true);
          router.reset();
          onResetWaitQueue();
        }, 300);
      },
      onOpen() {
        onOpen();
      },
    };
  }, [
    closeModalOnEsc,
    closeModalOnOverlayClick,
    dispatch,
    isClosable,
    isOpen,
    onClose,
    onOpen,
    router,
  ]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
