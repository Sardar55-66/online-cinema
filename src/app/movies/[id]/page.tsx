'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCinemas, useMovieSession, useMovies } from '@/app/lib/api';
import { CenteredMuiLoader } from '@/components/MuiLoader';
import { Button } from '@mui/material';

export default function FilmSchedule() {
  const { id } = useParams();
  const movieId = Number(id);
  const { data: sessions, isLoading: sessionsLoading } = useMovieSession(movieId);
  const { data: cinemas } = useCinemas();
  const { data: movies } = useMovies();

  const selectedMovie = movies?.find((movie) => movie.id === movieId);

  if (sessionsLoading || !sessions || !cinemas) {
    return <CenteredMuiLoader text="Загрузка сеансов..." />;
  }

  const schedule = sessions.reduce<Record<string, { cinemaId: number; times: string[] }[]>>(
    (acc, s) => {
      const dateStr = new Date(s.startTime).toLocaleDateString('ru-RU');
      const timeStr = new Date(s.startTime).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (!acc[dateStr]) acc[dateStr] = [];

      const dayArr = acc[dateStr];
      const cinemaEntry = dayArr.find((e) => e.cinemaId === s.cinemaId);
      if (cinemaEntry) {
        cinemaEntry.times.push(timeStr);
      } else {
        dayArr.push({ cinemaId: s.cinemaId, times: [timeStr] });
      }

      return acc;
    },
    {}
  );

  return (
    <div className="p-6 max-w-[900px] mx-auto">
      <div className="max-w-[900px] mx-auto">
        {/* Заголовок фильма */}
        <div className="mb-8">
          <h1 className="text-[24px] font-bold text-white mb-4 text-center my-[20px]">{selectedMovie?.title}</h1>

          {/* Информация о фильме */}
          <div className="bg-gray-900 rounded-lg p-6">
            <div className="flex gap-6">
              <div className="w-48 h-72 bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={selectedMovie?.posterImage}
                  alt={selectedMovie?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 ml-[15px]">
                <p className="max-w-[500px] mb-[115px] text-gray-300 mb-6 leading-relaxed">{selectedMovie?.description}</p>

                <div className="flex flex-col justify-between text-sm">
                  <div>
                    <span className="font-semibold text-gray-400">Год:</span>
                    <span className="text-white ml-2">{selectedMovie?.year}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Продолжительность:</span>
                    <span className="text-white ml-2">{selectedMovie?.lengthMinutes} мин</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-400">Рейтинг:</span>
                    <span className="text-white ml-2">{selectedMovie?.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Расписание сеансов */}
        <div className="space-y-6 mt-[35px]">
          {Object.entries(schedule).map(([date, cinemasOnDate]) => (
            <div key={date} className="bg-gray-900 rounded-lg p-6">
              {/* Дата */}
              <h2 className="text-xl font-semibold text-white mb-[10px] ml-[15px]">{date.slice(0, 5)}</h2>
              <hr />

              {/* Кинотеатры и сеансы */}
              <div className="space-y-4">
                {cinemasOnDate.map(({ cinemaId, times }, index) => {
                  const isLastCinema = index === cinemasOnDate.length - 1;
                  const cinemaName =
                    cinemas.find((c) => c.id === cinemaId)?.name || `Кинотеатр ${cinemaId}`;
                  return (
                    <div key={cinemaId} className="pb-4 last:border-b-0 flex justify-between">
                      {/* Название кинотеатра */}
                      <h3 className={`font-medium text-lg text-white ml-[15px] mt-[20px] ${isLastCinema ? 'mb-[50px]' : 'mb-[20px]'}`}>{cinemaName}</h3>

                      {/* Сеансы */}
                      <div className="flex flex-wrap gap-2 overflow-y-auto h-[100vh] scrollbar-hide">
                        {times.map((time) => {
                          // Находим сеанс по времени для получения ID
                          const session = sessions.find((s) => {
                            const sessionTime = new Date(s.startTime).toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                            return sessionTime === time && s.cinemaId === cinemaId;
                          });

                          return (
                            <Link key={time} href={`/movies/${movieId}/sessions/${session?.id}`}>
                            <span className="my-[20px] mx-[15px]">
                            <Button
                                variant="outlined"
                                className="mr-[15px] mt-[20px] text-[12px] rounded-lg p-[5px]"
                              >
                                {time}
                              </Button>
                            </span>
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
      </div>
    </div>
  );
}
