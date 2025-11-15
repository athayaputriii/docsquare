'use client';

import { ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="card w-full max-w-lg">
        {children}
        <button
          onClick={onClose}
          className="mt-4 rounded-full border border-white/20 px-4 py-2 text-sm text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
