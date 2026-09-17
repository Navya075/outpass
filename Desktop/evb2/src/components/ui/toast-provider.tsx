import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (options: { title: string; description?: string; type?: ToastType; duration?: number }) => void;
  toasts: Toast[];
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ title, description, type = 'info', duration = 4000 }: {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
  }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, description, type }]);

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
      
      {/* Toast viewport */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className="pointer-events-auto w-full glass-panel rounded-lg shadow-lg border border-border p-4 flex gap-3 items-start overflow-hidden"
            >
              {/* Type Icon */}
              <div className="mt-0.5 shrink-0">
                {t.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                {t.type === 'info' && <Info className="h-5 w-5 text-zinc-900" />}
              </div>

              {/* Contents */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-zinc-100">{t.title}</h4>
                {t.description && (
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{t.description}</p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded-md hover:bg-zinc-800/50"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
