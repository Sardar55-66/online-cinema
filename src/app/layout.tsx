import PageHeader from '@/components/PageHeader';
import { Sidebar } from '@/components/Sidebar';
import '@/styles/globals.css';
import { Providers } from './Providers';

export const metadata = {
  title: {
    default: 'My Cinema - Онлайн кинотеатр',
    template: '%s | My Cinema'
  },
  description: 'Современный онлайн кинотеатр с актуальными фильмами и удобным бронированием билетов. Смотрите расписание сеансов, бронируйте места онлайн.',
  keywords: ['кинотеатр', 'фильмы', 'билеты', 'онлайн бронирование', 'сеансы'],
  authors: [{ name: 'My Cinema Team' }],
  creator: 'My Cinema',
  publisher: 'My Cinema',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://mycinema.com',
    siteName: 'My Cinema',
    title: 'My Cinema - Онлайн кинотеатр',
    description: 'Современный онлайн кинотеатр с актуальными фильмами и удобным бронированием билетов.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Cinema - Онлайн кинотеатр',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Cinema - Онлайн кинотеатр',
    description: 'Современный онлайн кинотеатр с актуальными фильмами и удобным бронированием билетов.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-black h-screen overflow-hidden">
        <Providers>
          <div className="flex flex-col h-full">
            <PageHeader />
            <div className="flex flex-1 border border-white">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <div className="max-w-[900px] w-full mx-auto flex flex-col flex-1">
                  <main className="flex-1 bg-black text-white overflow-y-auto scrollbar-hide">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
