'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/app/lib/auth';
import { CenteredMuiLoader } from '@/components/MuiLoader';

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/my-tickets');
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <CenteredMuiLoader text="Проверка авторизации..." />;
  }

  return null;
}
