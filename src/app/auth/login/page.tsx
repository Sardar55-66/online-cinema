'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/lib/auth';
import { LoginFormData, validateLoginForm } from '@/app/lib/validators';
import { Button } from '@mui/material';
import { TIME } from '@/constants';

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginFormData>({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
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

        // Валидация формы
        const validationErrors = validateLoginForm(formData);
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
            await login(formData.username, formData.password);
            router.push('/my-tickets');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
            setErrors({ general: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center align-middle h-full bg-gray-100">
            <div className="w-max-[900px] max-w-md">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-[24px] mb-[45px] font-bold text-center mb-6 text-gray-900">Вход</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="max-w-[300px] mx-auto">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Имя пользователя
                            </label>

                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`w-full h-[50px] mb-[25px] p-[8px] border rounded-md ${errors.username ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Введите имя пользователя"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        <div className="max-w-[300px] mx-auto">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full h-[50px] mb-[35px] p-[8px] border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Введите пароль"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>


                        {errors.general && (
                            <div className="bg-red-100 mb-[15px] text-red-700">
                                {errors.general}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={isSubmitting}
                            className="w-[100px] p-[5px] text-[12px] rounded-[7px] my-[25px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Вход...' : 'Войти'}
                        </Button>
                    </form>


                    <div className="mt-6 text-center text-[18px] my-[25px]">
                        <p> Если у вас нет аккаунта{' '}
                            <a href="/auth/register" className="text-blue-600 hover:text-blue-500 border-b white pb-[4px]">
                                зарегистрируйтесь
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
