'use client';

import { useState } from 'react';
import { payBooking } from '@/app/lib/api';
import type { Booking, Cinema, Movie } from '@/types';
import { Timer } from './Timer';
import { ErrorToast } from './ErrorToast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { Button } from '@mui/material';

interface TicketCardProps {
    booking: Booking;
    movie: Movie;
    cinema: Cinema;
    timeLimitSeconds: number;
    onPaymentSuccess: () => void;
    onExpired: () => void;
}

export function TicketCard({
    booking,
    movie,
    cinema,
    timeLimitSeconds,
    onPaymentSuccess,
    onExpired,
}: TicketCardProps) {
    const [isPaying, setIsPaying] = useState(false);
    const { errors, showError, removeError } = useErrorHandler();

    const handlePayment = async () => {
        setIsPaying(true);
        try {
            await payBooking(booking.id);
            onPaymentSuccess();
        } catch (error: any) {
            showError(error.message);
        } finally {
            setIsPaying(false);
        }
    };

    const sessionTime = new Date(booking.bookedAt).toLocaleString('ru-RU');
    const isExpired =
        !booking.isPaid &&
        new Date().getTime() - new Date(booking.bookedAt).getTime() > timeLimitSeconds * 1000;

    const getStatusColor = () => {
        if (!booking.isPaid) {
            return isExpired ? 'bg-red-600' : 'bg-yellow-600';
        }
        return 'bg-green-600';
    };

    const getStatusText = () => {
        if (!booking.isPaid) {
            return isExpired ? 'Истек срок оплаты' : 'Неоплачен';
        }
        return 'Оплачен';
    };

    return (
        <div className="bg-black border-t border-white my-[15px]">
            {/* Error Toasts */}
            {errors.map((error) => (
                <ErrorToast
                    key={error.id}
                    message={error.message}
                    onClose={() => removeError(error.id)}
                />
            ))}

            <div className="flex items-center justify-between py-4 px-6">
                {/* Левая колонка - информация о фильме */}
                <div className="flex-1">
                    <h3 className="text-white text-lg font-semibold mb-1">{movie.title}</h3>
                    <p className="text-white text-sm mb-1">{cinema.name}</p>
                    <p className="text-white text-sm">{sessionTime}</p>
                </div>

                {/* Центральная колонка - места */}
                <div className="flex-1 ml-8">
                    {booking.seats.map((seat, index) => (
                        <p key={index} className="text-white text-sm">
                            Ряд {seat.rowNumber}, место {seat.seatNumber}
                        </p>
                    ))}
                </div>

                {/* Правая колонка - кнопка оплаты и таймер */}
                <div className="flex items-center gap-4">
                    {!booking.isPaid && !isExpired && (
                        <>
                            <Button
                                variant="outlined"
                                onClick={handlePayment}
                                disabled={isPaying}
                                className="px-4 py-2 text-[12px] mr-[25px] rounded disabled:opacity-50 disabled:cursor-not-allowed border-white text-white hover:bg-white hover:text-black"
                            >
                                {isPaying ? 'Оплата...' : 'Оплатить'}
                            </Button>
                            <span className='ml-[25px]'>
                                <Timer
                                    bookedAt={booking.bookedAt}
                                    timeLimitSeconds={timeLimitSeconds}
                                    onExpired={onExpired}
                                />
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
