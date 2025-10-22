import MoviesClient from "./MoviesClient";

export const metadata = {
  title: 'Фильмы',
  description: 'Актуальные фильмы в кинотеатре. Смотрите расписание сеансов, выбирайте удобное время и бронируйте билеты онлайн.',
  keywords: ['фильмы', 'кино', 'расписание', 'сеансы', 'билеты'],
  openGraph: {
    title: 'Фильмы | My Cinema',
    description: 'Актуальные фильмы в кинотеатре. Смотрите расписание сеансов, выбирайте удобное время и бронируйте билеты онлайн.',
    type: 'website',
  },
};

export default function MoviesPage() {
  return <MoviesClient />;
}

