import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModalType = 'pilot' | 'society_login' | 'resident_login' | 'download_app';

interface ModalContextType {
  isOpen: boolean;
  type: ModalType;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: ModalType }>({
    isOpen: false,
    type: 'pilot',
  });

  const openModal = (type: ModalType) => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen: modalState.isOpen,
        type: modalState.type,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
