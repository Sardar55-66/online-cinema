// типы для мест и бронирования
export type Seat = {
    row: number;
    seat: number;
};

export type SeatFromAPI = {
    rowNumber: number;
    seatNumber: number;
};

export type Booking = {
    id: string; // Изменено с number на string
    movieSessionId: number;
    movieId: number;
    cinemaId: number;
    userId: number;
    seats: SeatFromAPI[]; // Изменено с Seat[] на SeatFromAPI[]
    bookedAt: string;
    paidAt?: string;
    isPaid: boolean; // Изменено с status на isPaid
};
