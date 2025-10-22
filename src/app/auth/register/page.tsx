'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/lib/auth';
import { RegisterFormData, validateRegisterForm } from '@/app/lib/validators';
import { Button } from '@mui/material';

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        password: '',
        passwordConfirmation: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const validationErrors = validateRegisterForm(formData);
        if (validationErrors.length > 0) {
            const errorMap: Record<string, string> = {};
            validationErrors.forEach((error) => {
                errorMap[error.field] = error.message;
            });
            setErrors(errorMap);
            setIsSubmitting(false);
            return;
        }

        try {
            await register(formData.username, formData.password, formData.passwordConfirmation || '');
            router.push('/my-tickets');
        } catch (error: any) {
            setErrors({ general: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-[900px] text-center mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-[24px] mb-[15px] font-bold text-center mb-6 text-gray-900">Регистрация</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-left text-sm font-medium text-gray-700 mb-2">
                                Имя пользователя
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-[300px] h-[50px] p-[8px] border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Введите имя пользователя"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>
                        {errors.general && (
                            <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.general}
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm mt-[25px] text-left font-medium text-gray-700 mb-2">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-[300px] h-[50px] p-[8px] mp-[8px] border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Введите пароль"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <div className="max-w-[300px] mx-auto mb-[25px]">
                            <label htmlFor="passwordConfirmation" className="block text-left text-sm mt-[25px]  font-medium text-gray-700 mb-2">
                                Подтверждение пароля
                            </label>
                            <input
                                type="password"
                                id="passwordConfirmation"
                                name="passwordConfirmation"
                                value={formData.passwordConfirmation}
                                onChange={handleChange}
                                className={`w-[300px] h-[50px] p-[8px] border rounded-md ${errors.passwordConfirmation ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Повторите пароль"
                            />
                            {errors.passwordConfirmation && (
                                <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={isSubmitting}
                            className="w-full mt-[25px] my-[25px] block mx-auto h-[40px] text-[12px] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                    </form>

                    <div className="mt-6 text-cente mt-[25px]">
                        <p className="text-gray-600">
                            Уже есть аккаунт?{' '}
                            <a href="/auth/login" className="text-blue-600 hover:text-blue-500 my-[25px]">
                                Войти
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
