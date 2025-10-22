'use client';

import { Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface SuccessToastProps {
    message: string;
    onClose: () => void;
}

export function SuccessToast({ message, onClose }: SuccessToastProps) {
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
