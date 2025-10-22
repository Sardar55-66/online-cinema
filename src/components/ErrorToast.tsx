'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from '@mui/icons-material';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function ErrorToast({ message, onClose, duration = 5000 }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-[6px] p-[5px] shadow-lg border border-green-500 max-w-md min-w-fit animate-slide-in" style={{ right: '16px', top: '16px' }}>
        <div className="flex items-center gap-3">
            <CheckCircle className="text-green-200" />
            <span className="flex-1 text-sm font-medium">{message}</span>
            <button
                onClick={onClose}
                className="text-white border-white hover:bg-white hover:text-green-600 w-[30px] h-[30px] p-1 cursor-pointer"
            >
                ×
            </button>
        </div>
    </div>
);
}
