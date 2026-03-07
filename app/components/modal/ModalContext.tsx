'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Modal from './modal';
import "../../styles/main/main.scss";

interface ModalContextType {
  showModal: (props: ModalProps) => void;
  hideModal: () => void;
}

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<ModalProps>({
    title: '',
    message: '',
    onConfirm: () => {},
    showCancel: true,
  });

  const showModal = (props: ModalProps) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    modalProps.onConfirm();
    hideModal();
  };

  const handleCancel = () => {
    if (modalProps.onCancel) {
      modalProps.onCancel();
    }
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        title={modalProps.title}
        message={modalProps.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        showCancel={modalProps.showCancel}
      />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}