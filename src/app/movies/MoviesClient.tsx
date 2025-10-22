'use client';

import Link from 'next/link';
import { useMovies } from '@/app/lib/api';
import { CenteredMuiLoader } from '@/components/MuiLoader';
import { Button } from '@mui/material';

export default function MoviesClient() {
    const { data: movies, isLoading, error } = useMovies();

    if (isLoading) {
        return <CenteredMuiLoader text="Загрузка фильмов..." />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-full">
                <div className="text-center">
                    <p className="text-red-500 text-xl">Ошибка загрузки фильмов</p>
                    <p className="text-gray-400 mt-2">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-full">
                <div className="text-center">
                    <p className="text-gray-400 text-xl">Фильмы не найдены</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 scrollbar-hide">
            <div className="max-w-[900px] mx-auto">
                <div className="bg-gray-900 rounded-lg overflow-y-auto h-[100vh] scrollbar-hide">
                    <table className="w-full mt-[25px]">
                        <thead className='mb-[15px]'>
                            <tr className="border-b border-white mb-[15px]">
                                <th className="p-4 text-center"></th>
                                <th className="p-4 text-center text-white font-semibold">Название</th>
                                <th className="p-4 text-center text-white font-semibold">Продолжительность</th>
                                <th className="p-4 text-center text-white font-semibold">Рейтинг</th>
                                <th className="p-4 text-center"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie, index) => (
                                <tr key={movie.id} className={index < movies.length - 1 ? 'mb-[15px]' : ''}>
                                    <td className="p-4 text-center">
                                        <div className="w-16 h-24 bg-gray-800 rounded overflow-hidden mx-auto">
                                            <img
                                                src={movie.posterImage}
                                                alt={movie.title}
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4 text-white text-center">{movie.title}</td>
                                    <td className="p-4 text-white text-center">{movie.lengthMinutes} мин</td>
                                    <td className="p-4 text-white text-center">{movie.rating}</td>
                                    <td className="p-4 text-center">
                                        <Link href={`/movies/${movie.id}`}>
                                            <Button
                                                variant="outlined"
                                                className="text-[12px] rounded-lg px-4 py-2"
                                            >
                                                Посмотреть сеансы
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
