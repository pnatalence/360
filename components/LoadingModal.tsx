
import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, message = 'A processar...' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black bg-opacity-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-8 px-10 flex flex-col items-center justify-center transform transition-all animate-fadeIn">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-lg font-semibold text-gray-800 dark:text-white">{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
