'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            router.push('/movies');
        }
    }, [countdown, router]);

    // Структурированные данные для SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "MovieTheater",
        "name": "My Cinema",
        "description": "Современный онлайн кинотеатр с актуальными фильмами и удобным бронированием билетов",
        "url": "https://mycinema.com",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "RU"
        },
        "sameAs": [
            "https://mycinema.com"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-white mb-8">
                        Добро пожаловать в наш кинотеатр!
                    </h1>
                    <p className="text-2xl text-gray-300 mb-12">
                        Через мгновение вы переключитесь на фильмотеку
                    </p>
                    <div className="text-8xl font-bold text-blue-500 animate-pulse">
                        {countdown}
                    </div>
                    <p className="text-xl text-gray-400 mt-8">
                        секунд до перехода...
                    </p>
                </div>
            </div>
        </>
    );
}
