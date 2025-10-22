import type { Movie, Cinema, MovieSessionFromBackend } from '@/types';

export interface DataService {
    groupSessionsByDate(sessions: MovieSessionFromBackend[]): Record<string, { cinemaId: number; times: string[] }[]>;
    groupCinemaSessionsByDate(sessions: MovieSessionFromBackend[]): Record<string, { movieId: number; times: string[] }[]>;
    findMovieById(movies: Movie[], id: number): Movie | undefined;
    findCinemaById(cinemas: Cinema[], id: number): Cinema | undefined;
    formatSessionTime(startTime: string): string;
    formatSessionDate(startTime: string): string;
}

export class CinemaDataService implements DataService {
    groupSessionsByDate(sessions: MovieSessionFromBackend[]): Record<string, { cinemaId: number; times: string[] }[]>> {
        return sessions.reduce<Record<string, { cinemaId: number; times: string[] }[]>>(
            (acc, session) => {
                const dateStr = this.formatSessionDate(session.startTime);
                const timeStr = this.formatSessionTime(session.startTime);

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
            },
            {},
        );
    }

groupCinemaSessionsByDate(sessions: MovieSessionFromBackend[]): Record < string, { movieId: number; times: string[] }[] >> {
    return sessions.reduce<Record<string, { movieId: number; times: string[] }[]>>(
        (acc, session) => {
            const dateStr = this.formatSessionDate(session.startTime);
            const timeStr = this.formatSessionTime(session.startTime);

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
        },
        {},
    );
}

findMovieById(movies: Movie[], id: number): Movie | undefined {
    return movies.find((movie) => movie.id === id);
}

findCinemaById(cinemas: Cinema[], id: number): Cinema | undefined {
    return cinemas.find((cinema) => cinema.id === id);
}

formatSessionTime(startTime: string): string {
    return new Date(startTime).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

formatSessionDate(startTime: string): string {
    return new Date(startTime).toLocaleDateString('ru-RU');
}
}

// Экспортируем singleton instance
export const dataService = new CinemaDataService();
