import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
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

// получаем список всех фильмов
export const getMovies = async (): Promise<Movie[]> => {
  return apiClient.get<Movie[]>('/movies');
};

// получаем сеансы конкретного фильма
export const getMovieSession = async (movieId: number): Promise<MovieSessionFromBackend[]> => {
  return apiClient.get<MovieSessionFromBackend[]>(`/movies/${movieId}/sessions`);
};
// [ук react-query для списка фильмов (кэшируем через QueryClient)
export const useMovies = () => {
  return useQuery<Movie[]>({
    queryKey: ['movies'],
    queryFn: getMovies,
    staleTime: 1000 * 60 * 5,
  });
};

// Хук для сеансов фильма
export const useMovieSession = (movieId: number) => {
  return useQuery<MovieSessionFromBackend[]>({
    queryKey: ['movieSessions', movieId],
    queryFn: () => getMovieSession(movieId),
    staleTime: 1000 * 60 * 2,
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
    staleTime: 1000 * 60 * 10, // 10 минут
  });
};

// получаем сеансы кинотеатра
export const getCinemaSessions = async (cinemaId: number): Promise<MovieSessionFromBackend[]> => {
  return apiClient.get<MovieSessionFromBackend[]>(`/cinemas/${cinemaId}/sessions`);
};

// Хук для сеансов кинотеатра
export const useCinemaSessions = (cinemaId: number) => {
  return useQuery<MovieSessionFromBackend[]>({
    queryKey: ['cinemaSessions', cinemaId],
    queryFn: () => getCinemaSessions(cinemaId),
    staleTime: 1000 * 60 * 2,
    enabled: !!cinemaId,
  });
};

// получаем детали сеанса для бронирования
export const getMovieSessionDetails = async (sessionId: number): Promise<MovieSessionDetails> => {
  return apiClient.get<MovieSessionDetails>(`/movieSessions/${sessionId}`);
};

// Хук для деталей сеанса
export const useMovieSessionDetails = (sessionId: number, enabled: boolean = true) => {
  return useQuery<MovieSessionDetails>({
    queryKey: ['movieSessionDetails', sessionId],
    queryFn: () => getMovieSessionDetails(sessionId),
    staleTime: 1000 * 60 * 1,
    enabled: !!sessionId && enabled,
    retry: (failureCount, error: any) => {
      // не повторяем запрос если ошибка 401 (неавторизован)
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// бронирование мест
export const bookSeats = async (sessionId: number, seats: Seat[]): Promise<{ bookingId: string }> => {
  // конвертируем seat[] в формат api
  const apiSeats = seats.map(seat => ({
    rowNumber: seat.row,
    seatNumber: seat.seat
  }));

  const result = await apiClient.post<{ bookingId: string }>(`/movieSessions/${sessionId}/bookings`, { seats: apiSeats });
  return result;
};

// получаем билеты пользователя
export const getUserBookings = async (): Promise<Booking[]> => {
  return apiClient.get<Booking[]>('/me/bookings');
};

// Хук для билетов пользователя
export const useUserBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ['userBookings'],
    queryFn: getUserBookings,
    staleTime: 1000 * 60 * 1,
  });
};

// оплата билета
export const payBooking = async (bookingId: string): Promise<void> => {
  return apiClient.post<void>(`/bookings/${bookingId}/payments`);
};

// получаем настройки системы
export const getSettings = async (): Promise<Settings> => {
  return apiClient.get<Settings>('/settings');
};

// Хук для настроек
export const useSettings = () => {
  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 1000 * 60 * 10, // 10 минут
  });
};
