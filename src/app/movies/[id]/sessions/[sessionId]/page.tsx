'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { bookSeats, useCinemas, useMovieSessionDetails, useMovies } from '@/app/lib/api';
import type { Seat } from '@/types';
import { useAuth } from '@/app/lib/auth';
import { SeatMap } from '@/components/SeatMap';
import { CenteredMuiLoader } from '@/components/MuiLoader';
import { ErrorToast } from '@/components/ErrorToast';
import { SuccessToast } from '@/components/SuccessToast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useSuccessHandler } from '@/hooks/useSuccessHandler';
import { bookingService } from '@/services/bookingService';
import { Button } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

export default function SessionPage() {
    const { id, sessionId } = useParams();
    const movieId = Number(id);
    const sessionIdNum = Number(sessionId);

    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { errors, showError, removeError } = useErrorHandler();
    const { successes, showSuccess, removeSuccess } = useSuccessHandler();

    const { data: sessionDetails, isLoading: sessionLoading, refetch: refetchSessionDetails } = useMovieSessionDetails(sessionIdNum, true);
    const { data: movies } = useMovies();
    const { data: cinemas } = useCinemas();

    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [isBooking, setIsBooking] = useState(false);

    const movie = movies?.find((m) => m.id === movieId);
    const cinema = cinemas?.find((c) => c.id === sessionDetails?.cinemaId);

    if (sessionLoading || !sessionDetails || !movies || !cinemas) {
        return <CenteredMuiLoader text="Загрузка информации о сеансе..." />;
    }

    const handleBooking = async () => {
        if (!user) {
            router.push('/auth');
            return;
        }

        const validationError = bookingService.validateSeatSelection(selectedSeats, sessionDetails);
        if (validationError) {
            showError(validationError);
            return;
        }

        setIsBooking(true);
        try {
            const result = await bookSeats(sessionIdNum, selectedSeats);

            await refetchSessionDetails();

            await queryClient.invalidateQueries({ queryKey: ['userBookings'] });

            showSuccess('Места успешно забронированы!');
            setSelectedSeats([]);
            setTimeout(() => {
                router.push('/my-tickets');
            }, 2000);
        } catch (error: any) {
            showError(error.message || 'Ошибка при бронировании мест');
        } finally {
            setIsBooking(false);
        }
    };

    const sessionTime = new Date(sessionDetails.startTime).toLocaleString('ru-RU');


    return (
        <div className="p-6">
            {errors.map((error) => (
                <ErrorToast
                    key={error.id}
                    message={error.message}
                    onClose={() => removeError(error.id)}
                />
            ))}

            {successes.map((success) => (
                <SuccessToast
                    key={success.id}
                    message={success.message}
                    onClose={() => removeSuccess(success.id)}
                />
            ))}

            <div className="max-w-[900px] mx-auto">
                {/* Информация о сеансе */}
                <div className="mb-8">
                    <div className="bg-gray-900 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <h2 className='text-center text-[24px] mt-[25px] mb-[45px]'>Выбрать места</h2>
                            <div>
                                <div className="space-y-2 text-gray-300">
                                    <p><span className="font-semibold text-gray-400">Фильм:</span> {movie?.title}</p>
                                    <p><span className="font-semibold text-gray-400">Кинотеатр:</span> {cinema?.name}</p>
                                    <p><span className="font-semibold text-gray-400">Время:</span> {sessionTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Карта мест */}
                <div className="mb-8">
                    <SeatMap
                        rows={sessionDetails.seats.rows}
                        seatsPerRow={sessionDetails.seats.seatsPerRow}
                        bookedSeats={sessionDetails.bookedSeats}
                        onSeatSelect={setSelectedSeats}
                        selectedSeats={selectedSeats}
                    />
                </div>

                {/* бронирование */}
                <div className="text-center">
                    <Button
                        variant="outlined"
                        onClick={handleBooking}
                        disabled={isBooking || (!user && selectedSeats.length === 0)}
                        className="px-8 py-3 text-[12px] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isBooking ? 'Бронирование...' : user ? 'Забронировать' : 'Войти для бронирования'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
