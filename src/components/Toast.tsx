import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div
            id="toast-notification"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#171717] text-white dark:bg-white dark:text-[#171717] shadow-xl text-sm font-medium tracking-wide"
          >
            {type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 dark:text-rose-600" />
            )}
            <span>{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
