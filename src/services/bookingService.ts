import type { Booking, MovieSessionDetails, Seat } from '@/types';
import { SEAT_VALIDATION, VALIDATION_MESSAGES } from '@/constants';
import { BOOKING_STATUS } from '@/types/booking';

export const validateSeatSelection = (
    seats: Seat[],
    sessionDetails: MovieSessionDetails
): string | null => {
    if (seats.length === 0) {
        return VALIDATION_MESSAGES.SEATS_NOT_SELECTED;
    }

    // Проверяем, что все места находятся в пределах зала
    for (const seat of seats) {
        if (seat.row < SEAT_VALIDATION.MIN_ROW || seat.row > sessionDetails.seats.rows) {
            return VALIDATION_MESSAGES.SEAT_ROW_INVALID.replace('{row}', seat.row.toString());
        }
        if (
            seat.seat < SEAT_VALIDATION.MIN_SEAT ||
            seat.seat > sessionDetails.seats.seatsPerRow
        ) {
            return VALIDATION_MESSAGES.SEAT_NUMBER_INVALID.replace('{seat}', seat.seat.toString()).replace(
                '{row}',
                seat.row.toString()
            );
        }
    }

    // Проверяем, что места не заняты
    for (const seat of seats) {
        const isBooked = sessionDetails.bookedSeats.some(
            (bookedSeat) => bookedSeat.rowNumber === seat.row && bookedSeat.seatNumber === seat.seat
        );
        if (isBooked) {
            return VALIDATION_MESSAGES.SEAT_ALREADY_BOOKED.replace('{row}', seat.row.toString()).replace(
                '{seat}',
                seat.seat.toString()
            );
        }
    }

    return null;
};

export const calculateBookingExpiry = (bookedAt: string, timeLimitSeconds: number): boolean => {
    const bookedTime = new Date(bookedAt).getTime();
    const currentTime = new Date().getTime();
    const elapsedSeconds = Math.floor((currentTime - bookedTime) / 1000);
    return elapsedSeconds > timeLimitSeconds;
};

export const formatSeatDisplay = (seats: Seat[]): string => {
    return seats.map((seat) => `ряд ${seat.row}, место ${seat.seat}`).join(' | ');
};

export interface CategorizedBookings {
    unpaid: Booking[];
    future: Booking[];
    past: Booking[];
}

export const categorizeBookings = (
    bookings: Booking[],
    sessionTimes: Record<number, string>
): CategorizedBookings => {
    const currentTime = new Date().getTime();

    const unpaid: Booking[] = [];
    const future: Booking[] = [];
    const past: Booking[] = [];

    for (const booking of bookings) {
        if (booking.status === BOOKING_STATUS.UNPAID) {
            unpaid.push(booking);
        } else if (booking.status === BOOKING_STATUS.PAID) {
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
};
