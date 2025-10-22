'use client';

import { useState, useCallback } from 'react';

interface SuccessState {
    message: string;
    id: string;
}

export function useSuccessHandler() {
    const [successes, setSuccesses] = useState<SuccessState[]>([]);

    const showSuccess = useCallback((message: string) => {
        const id = Math.random().toString(36).substr(2, 9);
        setSuccesses(prev => [...prev, { message, id }]);

        // автоматически скрываем через 4 секунды
        setTimeout(() => {
            setSuccesses(prev => prev.filter(success => success.id !== id));
        }, 4000);
    }, []);

    const removeSuccess = useCallback((id: string) => {
        setSuccesses(prev => prev.filter(success => success.id !== id));
    }, []);

    const clearSuccesses = useCallback(() => {
        setSuccesses([]);
    }, []);

    return {
        successes,
        showSuccess,
        removeSuccess,
        clearSuccesses,
    };
}
