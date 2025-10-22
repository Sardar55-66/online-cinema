'use client';

import { useState, useCallback } from 'react';

interface ErrorState {
  message: string;
  id: string;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorState[]>([]);

  const showError = useCallback((message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setErrors(prev => [...prev, { message, id }]);
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    showError,
    removeError,
    clearErrors,
  };
}
