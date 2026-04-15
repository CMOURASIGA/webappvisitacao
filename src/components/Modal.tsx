import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-white w-full sm:max-w-[400px] h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-none sm:border-l sm:border-slate-200 shadow-xl flex flex-col animate-in slide-in-from-bottom-full sm:slide-in-from-right-full duration-300 sm:fixed sm:right-0 sm:top-0 sm:bottom-0"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-[18px] font-bold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
