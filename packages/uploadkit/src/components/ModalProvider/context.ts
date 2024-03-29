import React, { useContext } from 'react';

export interface ModalContextProps {
  isClosable: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const ModalContext = React.createContext({} as ModalContextProps);

export function useModal() {
  const context = useContext(ModalContext);
  return context;
}
