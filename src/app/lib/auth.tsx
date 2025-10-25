import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { setGlobalLogout } from '@/lib/apiClient';
import { API_ENDPOINTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

export interface User {
  id: number;
  username: string;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'user';

const loadUserFromStorage = (): User | null => {
  const savedUser = localStorage.getItem(STORAGE_KEY);
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error('Failed to parse user from storage:', error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const saveUserToStorage = (user: User): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const removeUserFromStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const loadedUser = loadUserFromStorage();
    setUser(loadedUser);
    setIsLoading(false);
  }, []);

  // Слушаем изменения в localStorage для автоматического обновления состояния
  useEffect(() => {
    const handleStorageChange = () => {
      const loadedUser = loadUserFromStorage();
      setUser(loadedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || ERROR_MESSAGES.LOGIN_FAILED);
      }

      const userData: User = await response.json();
      setUser(userData);
      saveUserToStorage(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, passwordConfirmation }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || ERROR_MESSAGES.REGISTRATION_FAILED);
      }

      const userData: User = await response.json();
      setUser(userData);
      saveUserToStorage(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeUserFromStorage();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Регистрируем функцию logout в apiClient для автоматического разлогина
  useEffect(() => {
    setGlobalLogout(logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
