import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PilotModal } from './PilotModal';
import { useModal } from '../context/ModalContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, type, openModal, closeModal } = useModal();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F172A] flex flex-col font-sans selection:bg-amber-400 selection:text-[#0F172A] relative">
      <Navbar onOpenModal={openModal} />
      
      <main className="flex-1 pt-20">
        {children}
      </main>

      <Footer onOpenModal={openModal} />

      <PilotModal
        isOpen={isOpen}
        type={type}
        onClose={closeModal}
      />
    </div>
  );
};
