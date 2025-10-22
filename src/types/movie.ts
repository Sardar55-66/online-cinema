// типы для фильмов и сеансов
export type Movie = {
    id: number;
    title: string;
    year: number;
    rating: number;
    posterImage: string;
    lengthMinutes: number;
    description: string;
};

export type MovieSessionFromBackend = {
    id: number;
    movieId: number;
    cinemaId: number;
    startTime: string;
};

export type MovieSessionDetails = {
    id: number;
    movieId: number;
    cinemaId: number;
    startTime: string;
    seats: {
        rows: number;
        seatsPerRow: number;
    };
    bookedSeats: SeatFromAPI[];
};
