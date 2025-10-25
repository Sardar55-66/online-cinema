import type { Movie, Cinema, MovieSessionFromBackend } from '@/types';

export interface GroupedSessionsByDate {
    [date: string]: Array<{
        cinemaId: number;
        times: string[];
    }>;
}

export interface GroupedCinemaSessionsByDate {
    [date: string]: Array<{
        movieId: number;
        times: string[];
    }>;
}

const formatSessionTime = (startTime: string): string => {
    return new Date(startTime).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatSessionDate = (startTime: string): string => {
    return new Date(startTime).toLocaleDateString('ru-RU');
};

export const groupSessionsByDate = (
    sessions: MovieSessionFromBackend[]
): GroupedSessionsByDate => {
    return sessions.reduce<GroupedSessionsByDate>((acc, session) => {
        const dateStr = formatSessionDate(session.startTime);
        const timeStr = formatSessionTime(session.startTime);

        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }

        const existingCinema = acc[dateStr].find((item) => item.cinemaId === session.cinemaId);

        if (existingCinema) {
            existingCinema.times.push(timeStr);
        } else {
            acc[dateStr].push({ cinemaId: session.cinemaId, times: [timeStr] });
        }

        return acc;
    }, {});
};

export const groupCinemaSessionsByDate = (
    sessions: MovieSessionFromBackend[]
): GroupedCinemaSessionsByDate => {
    return sessions.reduce<GroupedCinemaSessionsByDate>((acc, session) => {
        const dateStr = formatSessionDate(session.startTime);
        const timeStr = formatSessionTime(session.startTime);

        if (!acc[dateStr]) {
            acc[dateStr] = [];
        }

        const existingMovie = acc[dateStr].find((item) => item.movieId === session.movieId);

        if (existingMovie) {
            existingMovie.times.push(timeStr);
        } else {
            acc[dateStr].push({ movieId: session.movieId, times: [timeStr] });
        }

        return acc;
    }, {});
};

export const findMovieById = (movies: Movie[], id: number): Movie | undefined => {
    return movies.find((movie) => movie.id === id);
};

export const findCinemaById = (cinemas: Cinema[], id: number): Cinema | undefined => {
    return cinemas.find((cinema) => cinema.id === id);
};
