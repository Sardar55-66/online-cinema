import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { CACHE_TIME, HTTP_STATUS, TIME } from '@/constants';
import type {
  Movie,
  MovieSessionFromBackend,
  MovieSessionDetails,
  Cinema,
  Seat,
  SeatFromAPI,
  Booking,
  Settings
} from '@/types';

// Получаем список всех фильмов
export const getMovies = async (): Promise<Movie[]> => {
  return apiClient.get<Movie[]>('/movies');
};

// Получаем сеансы конкретного фильма
export const getMovieSession = async (movieId: number): Promise<MovieSessionFromBackend[]> => {
  return apiClient.get<MovieSessionFromBackend[]>(`/movies/${movieId}/sessions`);
};

// Хук react-query для списка фильмов (кэшируем через QueryClient)
export const useMovies = () => {
  return useQuery<Movie[]>({
    queryKey: ['movies'],
    queryFn: getMovies,
    staleTime: CACHE_TIME.MOVIES,
  });
};

// Хук для сеансов фильма
export const useMovieSession = (movieId: number) => {
  return useQuery<MovieSessionFromBackend[]>({
    queryKey: ['movieSessions', movieId],
    queryFn: () => getMovieSession(movieId),
    staleTime: CACHE_TIME.MOVIE_SESSIONS,
    enabled: !!movieId,
  });
};

export const getCinemas = async (): Promise<Cinema[]> => {
  return apiClient.get<Cinema[]>('/cinemas');
};

export const useCinemas = () => {
  return useQuery<Cinema[]>({
    queryKey: ['cinemas'],
    queryFn: getCinemas,
    staleTime: CACHE_TIME.CINEMAS,
  });
};

// Получаем сеансы кинотеатра
export const getCinemaSessions = async (cinemaId: number): Promise<MovieSessionFromBackend[]> => {
  return apiClient.get<MovieSessionFromBackend[]>(`/cinemas/${cinemaId}/sessions`);
};

// Хук для сеансов кинотеатра
export const useCinemaSessions = (cinemaId: number) => {
  return useQuery<MovieSessionFromBackend[]>({
    queryKey: ['cinemaSessions', cinemaId],
    queryFn: () => getCinemaSessions(cinemaId),
    staleTime: CACHE_TIME.MOVIE_SESSIONS,
    enabled: !!cinemaId,
  });
};

// Получаем детали сеанса для бронирования
export const getMovieSessionDetails = async (sessionId: number): Promise<MovieSessionDetails> => {
  return apiClient.get<MovieSessionDetails>(`/movieSessions/${sessionId}`);
};

interface ErrorWithMessage {
  message?: string;
}

// Хук для деталей сеанса
export const useMovieSessionDetails = (sessionId: number, enabled: boolean = true) => {
  return useQuery<MovieSessionDetails>({
    queryKey: ['movieSessionDetails', sessionId],
    queryFn: () => getMovieSessionDetails(sessionId),
    staleTime: CACHE_TIME.USER_BOOKINGS,
    enabled: !!sessionId && enabled,
    retry: (failureCount, error) => {
      const errorMessage = (error as ErrorWithMessage)?.message || '';
      // Не повторяем запрос если ошибка 401 (неавторизован)
      if (
        errorMessage.includes(HTTP_STATUS.UNAUTHORIZED.toString()) ||
        errorMessage.toLowerCase().includes('unauthorized')
      ) {
        return false;
      }
      return failureCount < TIME.RETRY_ATTEMPTS;
    },
  });
};

// Бронирование мест
export const bookSeats = async (sessionId: number, seats: Seat[]): Promise<{ bookingId: string }> => {
  // Конвертируем seat[] в формат API
  const apiSeats: SeatFromAPI[] = seats.map(seat => ({
    rowNumber: seat.row,
    seatNumber: seat.seat
  }));

  const result = await apiClient.post<{ bookingId: string }>(
    `/movieSessions/${sessionId}/bookings`,
    { seats: apiSeats }
  );
  return result;
};

// Получаем билеты пользователя
export const getUserBookings = async (): Promise<Booking[]> => {
  return apiClient.get<Booking[]>('/me/bookings');
};

// Хук для билетов пользователя
export const useUserBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: getUserBookings,
    staleTime: CACHE_TIME.USER_BOOKINGS,
  });
};

// Оплата билета
export const payBooking = async (bookingId: string): Promise<void> => {
  return apiClient.post<void>(`/bookings/${bookingId}/payments`);
};

// Получаем настройки системы
export const getSettings = async (): Promise<Settings> => {
  return apiClient.get<Settings>('/settings');
};

// Хук для настроек
export const useSettings = () => {
  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: CACHE_TIME.SETTINGS,
  });
};
