import React from 'react';
import { useSneakers } from '../context/SneakerContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSneakers();

  return (
    <div id="toast-container" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-md bg-neutral-900/95 border-neutral-800 text-white"
          >
            {toast.type === 'success' && (
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'error' && (
              <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            {toast.type === 'info' && (
              <div className="p-1 rounded-lg bg-orange-500/20 text-orange-400 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-neutral-100">{toast.title}</h4>
              <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-neutral-400 hover:text-white rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
