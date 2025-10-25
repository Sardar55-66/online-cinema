// типы для мест и бронирования
export type Seat = {
    row: number;
    seat: number;
};

export type SeatFromAPI = {
    rowNumber: number;
    seatNumber: number;
};

// Константы для статусов бронирования
export const BOOKING_STATUS = {
    UNPAID: 'unpaid',
    PAID: 'paid',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export type Booking = {
    id: string;
    movieSessionId: number;
    movieId: number;
    cinemaId: number;
    userId: number;
    seats: SeatFromAPI[];
    bookedAt: string;
    paidAt?: string;
    status: BookingStatus;
};
