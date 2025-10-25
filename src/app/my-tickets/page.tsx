'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMovieSessionDetails, useCinemas, useMovies, useSettings, useUserBookings } from '@/app/lib/api';
import type { Booking } from '@/types';
import { useAuth } from '@/app/lib/auth';
import { TicketCard } from '@/components/TicketCard';
import { CenteredMuiLoader } from '@/components/MuiLoader';

export default function TicketsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { data: bookings, isLoading: bookingsLoading, refetch } = useUserBookings();
  const { data: movies } = useMovies();
  const { data: cinemas } = useCinemas();
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useSettings();

  const [sessionTimes, setSessionTimes] = useState<Record<number, string>>({});
  const [sessionDetails, setSessionDetails] = useState<Record<number, { movieId: number; cinemaId: number; startTime: string }>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Дополнительная проверка для немедленного редиректа
  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setTimeout(() => {
        router.push('/auth');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

  // Получаем данные сеансов
  useEffect(() => {
    if (!bookings) return;

    const fetchSessionDetails = async () => {
      const uniqueSessionIds = [...new Set(bookings.map(b => b.movieSessionId))];
      const times: Record<number, string> = {};
      const details: Record<number, { movieId: number; cinemaId: number; startTime: string }> = {};

      await Promise.all(
        uniqueSessionIds.map(async (sessionId) => {
          try {
            const sessionData = await getMovieSessionDetails(sessionId);
            times[sessionId] = sessionData.startTime;
            details[sessionId] = {
              movieId: sessionData.movieId,
              cinemaId: sessionData.cinemaId,
              startTime: sessionData.startTime
            };
          } catch (error) {
            console.error(`Ошибка загрузки сеанса ${sessionId}:`, error);
          }
        })
      );

      setSessionTimes(times);
      setSessionDetails(details);
    };

    fetchSessionDetails();
  }, [bookings]);


  // Все хуки должны быть до любых условных return'ов
  if (authLoading || bookingsLoading || settingsLoading) {
    return <CenteredMuiLoader text="Загрузка билетов..." />;
  }

  if (!user) {
    return <CenteredMuiLoader text="Перенаправление на страницу авторизации..." />;
  }

  if (!bookings || !movies || !cinemas || !settings) {
    return <div className="text-white text-center mt-10">Ошибка загрузки данных</div>;
  }

  // Фильтруем истекшие билеты
  const validBookings = (bookings || []).filter((booking) => {
    if (booking.status === 'unpaid') {
      const timeLimit = settings?.paymentTimeLimitSeconds || 180;
      const isExpired =
        new Date().getTime() - new Date(booking.bookedAt).getTime() >
        timeLimit * 1000;
      return !isExpired;
    }
    return true;
  });

  // Группируем билеты по статусам
  const unpaidBookings = validBookings.filter((b) => b.status === 'unpaid');

  // Разделяем оплаченные билеты на будущие и прошедшие
  const currentTime = new Date().getTime();
  const futureBookings = validBookings.filter((b) => {
    if (b.status !== 'paid') return false;
    const sessionStartTime = sessionTimes[b.movieSessionId];
    if (!sessionStartTime) return true; // Если время неизвестно, показываем как будущий
    return new Date(sessionStartTime).getTime() > currentTime;
  });

  const pastBookings = validBookings.filter((b) => {
    if (b.status !== 'paid') return false;
    const sessionStartTime = sessionTimes[b.movieSessionId];
    if (!sessionStartTime) return false;
    return new Date(sessionStartTime).getTime() <= currentTime;
  });

  const handlePaymentSuccess = () => {
    refetch(); // Обновляем список билетов
  };

  const handleExpired = () => {
    refetch(); // Обновляем список билетов после истечения времени
  };

  const renderBookingSection = (title: string, bookings: Booking[], color: string) => {
    if (bookings.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => {
            // Получаем movieId и cinemaId из данных сеанса
            const sessionData = sessionDetails[booking.movieSessionId];
            const movieId = booking.movieId || sessionData?.movieId;
            const cinemaId = booking.cinemaId || sessionData?.cinemaId;

            const movie = movies.find((m) => m.id === movieId);
            const cinema = cinemas.find((c) => c.id === cinemaId);

            if (!movie || !cinema) return null;

            return (
              <TicketCard
                key={booking.id}
                booking={booking}
                movie={movie}
                cinema={cinema}
                timeLimitSeconds={settings.paymentTimeLimitSeconds}
                onPaymentSuccess={handlePaymentSuccess}
                onExpired={handleExpired}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center text-[24px] my-[25px]">Мои билеты</h1>

        {validBookings.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p className="text-xl">У вас пока нет билетов</p>
            <p className="text-sm mt-2">Выберите фильм и забронируйте места</p>
          </div>
        ) : (
          <div>
            {renderBookingSection('Неоплаченные', unpaidBookings, 'text-yellow-400 my-[10px]')}
            {renderBookingSection('Будущие', futureBookings, 'text-green-400 my-[10px]')}
            {renderBookingSection('Прошедшие', pastBookings, 'text-gray-400 my-[10px]')}
          </div>
        )}
      </div>
    </div>
  );
}
