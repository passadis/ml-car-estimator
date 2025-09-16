// /app/components/Modal.tsx

"use client";

import { X } from 'lucide-react';
import React from 'react';

// Define the props the Modal will accept
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Content to display inside
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // Don't render anything if the modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    // Main container with a fixed position to cover the screen
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose} // Close modal if background is clicked
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl m-4"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        {/* Modal content passed as children */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;