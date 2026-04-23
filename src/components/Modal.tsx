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
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex justify-center sm:justify-end items-end sm:items-stretch">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:w-[480px] h-[100dvh] sm:h-full bg-white rounded-none sm:rounded-none sm:border-l sm:border-slate-200 shadow-2xl flex flex-col"
      >
        <div className="h-14 px-4 border-b border-slate-200 bg-[var(--color-brand-dark)] text-white flex items-center justify-between pt-[max(env(safe-area-inset-top),0px)]">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-white/10" aria-label="Fechar modal">
            <X size={18} />
          </button>
        </div>
        <div className="p-3 sm:p-4 overflow-y-auto pb-[max(env(safe-area-inset-bottom),12px)]">{children}</div>
      </div>
    </div>
  );
}
