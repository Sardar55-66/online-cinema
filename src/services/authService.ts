import { User } from '@/app/lib/auth';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '@/constants';

const MIN_USER_ID = 0;

export const validateLoginCredentials = (
  username: string,
  password: string
): string | null => {
  if (!username.trim()) {
    return VALIDATION_MESSAGES.USERNAME_REQUIRED;
  }
  if (!password) {
    return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  }
  return null;
};

export const validateRegistrationData = (
  username: string,
  password: string,
  passwordConfirmation: string
): string | null => {
  // Валидация username
  if (!username.trim()) {
    return VALIDATION_MESSAGES.USERNAME_REQUIRED;
  }
  if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return VALIDATION_MESSAGES.USERNAME_TOO_SHORT;
  }

  // Валидация password
  if (!password) {
    return VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  }

  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
  }
  if (VALIDATION_RULES.PASSWORD_REQUIRES_UPPERCASE && !/[A-Z]/.test(password)) {
    return VALIDATION_MESSAGES.PASSWORD_NO_UPPERCASE;
  }
  if (VALIDATION_RULES.PASSWORD_REQUIRES_NUMBER && !/\d/.test(password)) {
    return VALIDATION_MESSAGES.PASSWORD_NO_NUMBER;
  }

  // Валидация подтверждения пароля
  if (!passwordConfirmation) {
    return VALIDATION_MESSAGES.PASSWORD_CONFIRMATION_REQUIRED;
  }
  if (password !== passwordConfirmation) {
    return VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH;
  }

  return null;
};

export const isUserAuthenticated = (user: User | null): boolean => {
  return user !== null && user.id > MIN_USER_ID;
};

export const shouldRedirectToAuth = (user: User | null, isLoading: boolean): boolean => {
  return !isLoading && !isUserAuthenticated(user);
};
