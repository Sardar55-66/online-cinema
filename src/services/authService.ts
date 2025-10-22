import { User } from '@/app/lib/auth';

export interface AuthService {
  validateLoginCredentials(username: string, password: string): string | null;
  validateRegistrationData(username: string, password: string, passwordConfirmation: string): string | null;
  isUserAuthenticated(user: User | null): boolean;
  shouldRedirectToAuth(user: User | null, isLoading: boolean): boolean;
}

export class CinemaAuthService implements AuthService {
  validateLoginCredentials(username: string, password: string): string | null {
    if (!username.trim()) {
      return 'Имя пользователя обязательно';
    }
    if (!password) {
      return 'Пароль обязателен';
    }
    return null;
  }

  validateRegistrationData(username: string, password: string, passwordConfirmation: string): string | null {
    // Валидация username
    if (!username.trim()) {
      return 'Имя пользователя обязательно';
    } else if (username.length < 8) {
      return 'Имя пользователя должно содержать минимум 8 символов';
    }

    // Валидация password
    if (!password) {
      return 'Пароль обязателен';
    } else {
      if (password.length < 8) {
        return 'Пароль должен содержать минимум 8 символов';
      }
      if (!/[A-Z]/.test(password)) {
        return 'Пароль должен содержать минимум 1 заглавную букву';
      }
      if (!/\d/.test(password)) {
        return 'Пароль должен содержать минимум 1 цифру';
      }
    }

    // Валидация подтверждения пароля
    if (!passwordConfirmation) {
      return 'Подтверждение пароля обязательно';
    } else if (password !== passwordConfirmation) {
      return 'Пароли не совпадают';
    }

    return null;
  }

  isUserAuthenticated(user: User | null): boolean {
    return user !== null && user.id > 0;
  }

  shouldRedirectToAuth(user: User | null, isLoading: boolean): boolean {
    return !isLoading && !this.isUserAuthenticated(user);
  }
}

// Экспортируем singleton instance
export const authService = new CinemaAuthService();
