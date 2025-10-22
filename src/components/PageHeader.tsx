'use client';

import { usePathname } from 'next/navigation';

export default function PageHeader() {
  const pathname = usePathname();

  const titles: Record<string, string> = {
    '/movies': 'Фильмы',
    '/cinemas': 'Кинотеатры',
    '/my-tickets': 'Мои билеты',
    '/auth': 'Вход',
    '/auth/login': 'Вход',
    '/auth/register': 'Регистрация',
  };

  const title = titles[pathname] || '';

  return (
    <header className="px-6 py-3 my-[25px]">
      <h1 className="text-[28px] font-bold text-white">{title}</h1>
    </header>
  );
}
