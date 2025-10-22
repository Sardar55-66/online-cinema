'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCinemaSessions, useCinemas, useMovies } from '@/app/lib/api';
import { CenteredMuiLoader } from '@/components/MuiLoader';
import { Button } from '@mui/material';

export default function CinemaPage() {
    const { id } = useParams();
    const cinemaId = Number(id);

    const { data: sessions, isLoading: sessionsLoading } = useCinemaSessions(cinemaId);
    const { data: cinemas } = useCinemas();
    const { data: movies } = useMovies();

    const cinema = cinemas?.find((c) => c.id === cinemaId);

    if (sessionsLoading || !sessions || !cinemas || !movies) {
        return <CenteredMuiLoader text="Загрузка сеансов кинотеатра..." />;
    }

    const schedule = sessions.reduce<Record<string, { movieId: number; times: string[] }[]>>(
        (acc, s) => {
            const dateStr = new Date(s.startTime).toLocaleDateString('ru-RU');
            const timeStr = new Date(s.startTime).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            });

            if (!acc[dateStr]) acc[dateStr] = [];

            const dayArr = acc[dateStr];
            const movieEntry = dayArr.find((e) => e.movieId === s.movieId);
            if (movieEntry) {
                movieEntry.times.push(timeStr);
            } else {
                dayArr.push({ movieId: s.movieId, times: [timeStr] });
            }

            return acc;
        },
        {}
    );

    return (
        <div className="p-6 max-w-[900px] mx-auto overflow-y-auto h-[100vh] scrollbar-hide">
            <div className="max-w-6xl mx-auto">
                {/* Заголовок кинотеатра */}
                <div className="mb-8">
                    <h1 className="text-[24px] font-bold text-white mb-4 text-center my-[20px]">{cinema?.name}</h1>
                    <hr />
                </div>

                {/* Расписание сеансов */}
                <div className="space-y-6 mt-[35px]">
                    {Object.entries(schedule).map(([date, moviesOnDate]) => (
                        <div key={date} className="bg-gray-900 rounded-lg p-6">
                            {/* Дата */}
                            <h2 className="text-xl font-semibold text-white mb-4 ml-[15px]">{date.slice(0, 5)}</h2>
                            <hr />

                            {/* Фильмы и сеансы */}
                            <div className="space-y-4">
                                {moviesOnDate.map(({ movieId, times }, index) => {
                                    const movie = movies.find((m) => m.id === movieId);
                                    const isLastMovie = index === moviesOnDate.length - 1;
                                    if (!movie) return null;

                                    return (
                                        <div key={movieId} className={`pb-4 last:border-b-0 flex justify-between ${isLastMovie ? 'mb-[50px]' : ''}`}>
                                            {/* Постер и название фильма */}
                                            <div className="flex gap-4 items-center">
                                                <div className="w-16 h-24 bg-gray-800 rounded overflow-hidden">
                                                    <img
                                                        src={movie.posterImage}
                                                        alt={movie.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <h3 className={`font-medium text-lg text-white ml-[15px] mt-[20px] mb-[20px]`}>
                                                    {movie.title}
                                                </h3>
                                            </div>

                                            {/* Сеансы */}
                                            <div className="flex flex-wrap gap-2">
                                                {times.map((time) => {
                                                    // Находим сеанс по времени для получения ID
                                                    const session = sessions.find((s) => {
                                                        const sessionTime = new Date(s.startTime).toLocaleTimeString('ru-RU', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        });
                                                        return sessionTime === time && s.movieId === movieId;
                                                    });

                                                    return (
                                                        <Link key={time} href={`/movies/${movieId}/sessions/${session?.id}`}>
                                                            <Button
                                                                variant="outlined"
                                                                className="mr-[15px] mt-[20px] text-[12px] rounded-lg p-[5px]"
                                                            >
                                                                {time}
                                                            </Button>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {Object.keys(schedule).length === 0 && (
                    <div className="text-center text-gray-400 mt-10">
                        <p>В этом кинотеатре пока нет сеансов</p>
                    </div>
                )}
            </div>
        </div>
    );
}
