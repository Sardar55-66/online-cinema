'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/lib/auth';

export const Sidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const tabs: Array<{
    label: string;
    href: string;
    onClick?: () => void;
  }> = [
      { label: 'Фильмы', href: '/movies' },
      { label: 'Кинотеатры', href: '/cinemas' },
      { label: 'Мои билеты', href: '/my-tickets' },
      {
        label: user ? 'Выход' : 'Вход',
        href: user ? '#' : '/auth/login',
        onClick: user ? logout : undefined,
      },
    ];

  const isActive = (href: string) => {
    if (href === '#') return false;
    return pathname.startsWith(href);
  };

  return (
    <div className="w-[15%] min-h-[60%] bg-gray-900 border-r border-b border-gray-700 flex flex-col">
      <nav className="flex-1 flex justify-center pt-8 ">
        <ul className="w-full">
          {tabs.map((tab) => (
            <li className='my-[25px]' key={tab.href}>
              {tab.onClick ? (
                <button
                  onClick={tab.onClick}
                  className={`block w-full text-left px-6 py-[10px] transition-colors ${isActive(tab.href)
                    ? 'bg-[#616468] text-white border-y border-gray-600'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <span className='text-[16px] block translate-x-[53px]'>{tab.label}</span>
                </button>
              ) : (
                <Link
                  href={tab.href}
                  className={`block w-full text-left px-6 py-[10px] transition-colors ${isActive(tab.href)
                    ? 'bg-[#616468] text-white border-y border-gray-600'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <span className='text-[16px] block translate-x-[53px]'>{tab.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
