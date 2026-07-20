import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const maxW = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl' }[size];

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/50 backdrop-blur-md transition-all duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-950/20 w-full ${maxW} flex flex-col relative animate-pop-in overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-150 text-slate-400 hover:text-slate-700 transition-all cursor-pointer border border-transparent hover:border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[75vh] scroll-hide">{children}</div>
      </div>
    </div>,
    document.body
  );
};
