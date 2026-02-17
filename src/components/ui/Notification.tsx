'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type NotificationType = 'success' | 'error' | 'loading';

interface NotificationProps {
  message: string;
  type: NotificationType;
  isOpen: boolean;
  onClose: () => void;
}

export const Notification = ({ message, type, isOpen, onClose }: NotificationProps) => {
  useEffect(() => {
    if (isOpen && type !== 'loading') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto"
          >
            <div className={`glass p-6 min-w-[300px] border tracking-tighter ${
              type === 'success' ? 'border-primary/50 text-primary' : 
              type === 'error' ? 'border-red-500/50 text-red-500' : 
              'border-white/20 text-white'
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                  {type === 'error' && <AlertCircle className="w-6 h-6" />}
                  {type === 'loading' && <Loader2 className="w-6 h-6 animate-spin" />}
                </div>
                <div className="flex-grow">
                  <p className="font-mono text-[10px] uppercase opacity-50 mb-1">
                    {type === 'loading' ? 'Processing...' : 'System_Status'}
                  </p>
                  <p className="font-bold text-sm leading-tight">{message}</p>
                </div>
                {type !== 'loading' && (
                  <button 
                    onClick={onClose}
                    className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Progress bar for auto-closing */}
              {type !== 'loading' && (
                <motion.div 
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 3, ease: "linear" }}
                  className={`absolute bottom-0 left-0 right-0 h-0.5 origin-left ${
                    type === 'success' ? 'bg-primary' : 'bg-red-500'
                  }`}
                />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
