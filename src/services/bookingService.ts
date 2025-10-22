import type { Booking, MovieSessionDetails, Seat } from '@/types';

export interface BookingService {
    validateSeatSelection(seats: Seat[], sessionDetails: MovieSessionDetails): string | null;
    calculateBookingExpiry(bookedAt: string, timeLimitSeconds: number): boolean;
    formatSeatDisplay(seats: Seat[]): string;
    categorizeBookings(bookings: Booking[], sessionTimes: Record<number, string>): {
        unpaid: Booking[];
        future: Booking[];
        past: Booking[];
    };
}

export class CinemaBookingService implements BookingService {
    validateSeatSelection(seats: Seat[], sessionDetails: MovieSessionDetails): string | null {
        if (seats.length === 0) {
            return 'Выберите места для бронирования';
        }

        // Проверяем, что все места находятся в пределах зала
        for (const seat of seats) {
            if (seat.row < 1 || seat.row > sessionDetails.seats.rows) {
                return `Ряд ${seat.row} не существует в этом зале`;
            }
            if (seat.seat < 1 || seat.seat > sessionDetails.seats.seatsPerRow) {
                return `Место ${seat.seat} не существует в ряду ${seat.row}`;
            }
        }

        // Проверяем, что места не заняты
        for (const seat of seats) {
            const isBooked = sessionDetails.bookedSeats.some(
                bookedSeat => bookedSeat.rowNumber === seat.row && bookedSeat.seatNumber === seat.seat
            );
            if (isBooked) {
                return `Место ряд ${seat.row}, место ${seat.seat} уже занято`;
            }
        }

        return null;
    }

    calculateBookingExpiry(bookedAt: string, timeLimitSeconds: number): boolean {
        const bookedTime = new Date(bookedAt).getTime();
        const currentTime = new Date().getTime();
        const elapsedSeconds = Math.floor((currentTime - bookedTime) / 1000);
        return elapsedSeconds > timeLimitSeconds;
    }

    formatSeatDisplay(seats: Seat[]): string {
        return seats
            .map(seat => `ряд ${seat.row}, место ${seat.seat}`)
            .join(' | ');
    }

    categorizeBookings(bookings: Booking[], sessionTimes: Record<number, string>): {
        unpaid: Booking[];
        future: Booking[];
        past: Booking[];
    } {
        const currentTime = new Date().getTime();

        const unpaid: Booking[] = [];
        const future: Booking[] = [];
        const past: Booking[] = [];

        for (const booking of bookings) {
            if (booking.status === 'unpaid') {
                unpaid.push(booking);
            } else if (booking.status === 'paid') {
                const sessionStartTime = sessionTimes[booking.movieSessionId];
                if (!sessionStartTime) {
                    future.push(booking); // Если время неизвестно, считаем будущим
                } else if (new Date(sessionStartTime).getTime() > currentTime) {
                    future.push(booking);
                } else {
                    past.push(booking);
                }
            }
        }

        return { unpaid, future, past };
    }
}

// Экспортируем singleton instance
export const bookingService = new CinemaBookingService();
