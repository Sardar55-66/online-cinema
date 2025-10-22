import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { setGlobalLogout } from '@/lib/apiClient';

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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем сохраненную сессию при загрузке
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (_error) {
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  // слушаем изменения в localStorage для автоматического обновления состояния
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (_error) {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/proxy/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Неверный логин или пароль. Проверьте введенные данные и попробуйте снова');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/proxy/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка регистрации');
      }

      // после успешной регистрации автоматически логинимся
      await login(username, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // используем router.push вместо window.location.href для корректного обновления состояния
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // регистрируем функцию logout в apiClient для автоматического разлогина
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
