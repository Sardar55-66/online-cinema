import { validateLoginForm, validateRegisterForm } from '@/app/lib/validators';

describe('Form Validators', () => {
    describe('validateLoginForm', () => {
        it('should return no errors for valid login data', () => {
            const validData = {
                username: 'testuser',
                password: 'password123',
            };

            const errors = validateLoginForm(validData);
            expect(errors).toHaveLength(0);
        });

        it('should return error for empty username', () => {
            const invalidData = {
                username: '',
                password: 'password123',
            };

            const errors = validateLoginForm(invalidData);
            expect(errors).toHaveLength(1);
            expect(errors[0].field).toBe('username');
            expect(errors[0].message).toBe('Имя пользователя обязательно');
        });

        it('should return error for empty password', () => {
            const invalidData = {
                username: 'testuser',
                password: '',
            };

            const errors = validateLoginForm(invalidData);
            expect(errors).toHaveLength(1);
            expect(errors[0].field).toBe('password');
            expect(errors[0].message).toBe('Пароль обязателен');
        });

        it('should return multiple errors for empty fields', () => {
            const invalidData = {
                username: '',
                password: '',
            };

            const errors = validateLoginForm(invalidData);
            expect(errors).toHaveLength(2);
        });
    });

    describe('validateRegisterForm', () => {
        it('should return no errors for valid registration data', () => {
            const validData = {
                username: 'testuser123',
                password: 'Password123',
                passwordConfirmation: 'Password123',
            };

            const errors = validateRegisterForm(validData);
            expect(errors).toHaveLength(0);
        });

        it('should return error for short username', () => {
            const invalidData = {
                username: 'test',
                password: 'Password123',
                passwordConfirmation: 'Password123',
            };

            const errors = validateRegisterForm(invalidData);
            expect(errors).toHaveLength(1);
            expect(errors[0].field).toBe('username');
            expect(errors[0].message).toBe('Имя пользователя должно содержать минимум 8 символов');
        });

        it('should return error for password without uppercase letter', () => {
            const invalidData = {
                username: 'testuser123',
                password: 'password123',
                passwordConfirmation: 'password123',
            };

            const errors = validateRegisterForm(invalidData);
            expect(errors).toHaveLength(1);
            expect(errors[0].field).toBe('password');
            expect(errors[0].message).toBe('Пароль должен содержать минимум 1 заглавную букву');
        });

        it('should return error for password without digit', () => {
            const invalidData = {
                username: 'testuser123',
                password: 'Password',
                passwordConfirmation: 'Password',
            };

            const errors = validateRegisterForm(invalidData);
            expect(errors).toHaveLength(1);
            expect(errors[0].field).toBe('password');
            expect(errors[0].message).toBe('Пароль должен содержать минимум 1 цифру');
        });

        it('should return error for mismatched passwords', () => {
            const invalidData = {
                username: 'testuser123',
                password: 'Password123',
                passwordConfirmation: 'Password456',
            };

            const errors = validateRegisterForm(invalidData);
            expect(errors).toHaveLength(1);
            expect(errors[0].field).toBe('passwordConfirmation');
            expect(errors[0].message).toBe('Пароли не совпадают');
        });

        it('should return multiple errors for invalid data', () => {
            const invalidData = {
                username: 'test',
                password: 'pass',
                passwordConfirmation: 'different',
            };

            const errors = validateRegisterForm(invalidData);
            expect(errors.length).toBeGreaterThan(1);
        });
    });
});
