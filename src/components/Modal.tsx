// Modal.tsx
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-800 opacity-75" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg z-10 max-w-lg w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export default Modal;

