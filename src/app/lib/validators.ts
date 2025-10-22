export interface ValidationError {
  field: string;
  message: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  passwordConfirmation?: string;
}

export function validateLoginForm(data: LoginFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.username.trim()) {
    errors.push({ field: 'username', message: 'Имя пользователя обязательно' });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Пароль обязателен' });
  }

  return errors;
}

export function validateRegisterForm(data: RegisterFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Валидация username
  if (!data.username.trim()) {
    errors.push({ field: 'username', message: 'Имя пользователя обязательно' });
  } else if (data.username.length < 8) {
    errors.push({
      field: 'username',
      message: 'Имя пользователя должно содержать минимум 8 символов',
    });
  }

  if (!data.password) {
    errors.push({ field: 'password', message: 'Пароль обязателен' });
  } else {
    if (data.password.length < 8) {
      errors.push({ field: 'password', message: 'Пароль должен содержать минимум 8 символов' });
    }

    if (!/[A-Z]/.test(data.password)) {
      errors.push({
        field: 'password',
        message: 'Пароль должен содержать минимум 1 заглавную букву',
      });
    }

    if (!/\d/.test(data.password)) {
      errors.push({ field: 'password', message: 'Пароль должен содержать минимум 1 цифру' });
    }
  }

  if (!data.passwordConfirmation) {
    errors.push({ field: 'passwordConfirmation', message: 'Подтверждение пароля обязательно' });
  } else if (data.password !== data.passwordConfirmation) {
    errors.push({ field: 'passwordConfirmation', message: 'Пароли не совпадают' });
  }

  return errors;
}
