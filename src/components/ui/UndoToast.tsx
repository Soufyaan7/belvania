'use client';

import React, { useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
}

export const UndoToast: React.FC<UndoToastProps> = ({
  message,
  onUndo,
  onDismiss,
  durationMs = 6000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onDismiss]);

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-safe right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#141414] text-[#FAF8F5] shadow-xl border border-[#CBB281]/40 rounded-none animate-in fade-in slide-in-from-bottom-3 duration-200 motion-reduce:animate-none"
    >
      <span className="text-xs sm:text-sm font-medium tracking-wide">
        {message}
      </span>

      <div className="flex items-center gap-2 border-l border-white/20 pl-3">
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#CBB281] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-1 focus:ring-[#CBB281]"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
          <span>Annuler</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="p-1 text-white/60 hover:text-white transition-colors focus:outline-none"
          aria-label="Fermer la notification"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    </aside>
  );
};
