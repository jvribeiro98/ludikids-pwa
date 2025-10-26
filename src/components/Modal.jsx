import React from 'react';

export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20">
      <div className="bg-white w-full sm:w-[520px] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#EFD179] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#78C3C7]">{title}</h3>
          <button onClick={onClose} className="text-[#E99A8C]">Fechar</button>
        </div>
        <div className="space-y-3">{children}</div>
        {actions && <div className="mt-4 flex gap-2 justify-end">{actions}</div>}
      </div>
    </div>
  );
}

