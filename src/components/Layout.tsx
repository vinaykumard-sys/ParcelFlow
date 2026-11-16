import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PilotModal } from './PilotModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'pilot' | 'society_login' | 'resident_login' | 'download_app';
  }>({
    isOpen: false,
    type: 'pilot',
  });

  const handleOpenModal = (type: 'pilot' | 'society_login' | 'resident_login' | 'download_app') => {
    setModalState({ isOpen: true, type });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      <Navbar onOpenModal={handleOpenModal} />
      
      <main className="flex-1 pt-20">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, { 
              onOpenModal: handleOpenModal,
              onOpenPilotModal: () => handleOpenModal('pilot')
            });
          }
          return child;
        })}
      </main>

      <Footer onOpenModal={handleOpenModal} />

      <PilotModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={handleCloseModal}
      />
    </div>
  );
};
