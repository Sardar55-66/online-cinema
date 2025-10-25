// Константы для приложения

// Сроки кеширования данных (в миллисекундах)
export const CACHE_TIME = {
    MOVIES: 1000 * 60 * 5, // 5 минут
    MOVIE_SESSIONS: 1000 * 60 * 2, // 2 минуты
    CINEMAS: 1000 * 60 * 10, // 10 минут
    USER_BOOKINGS: 1000 * 60 * 1, // 1 минута
    SETTINGS: 1000 * 60 * 10, // 10 минут
} as const;

// Валидация формы
export const VALIDATION_RULES = {
    USERNAME_MIN_LENGTH: 8,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_REQUIRES_UPPERCASE: true,
    PASSWORD_REQUIRES_NUMBER: true,
} as const;

// Валидация мест
export const SEAT_VALIDATION = {
    MIN_ROW: 1,
    MIN_SEAT: 1,
} as const;

// Временные интервалы
export const TIME = {
    REDIRECT_DELAY_MS: 2000,
    RETRY_ATTEMPTS: 3,
} as const;

// HTTP статусы
export const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
} as const;

// Константы для карты мест
export const SEAT_MAP = {
    DEFAULT_ROWS: 6,
    DEFAULT_SEATS_PER_ROW: 10,
    SEAT_SIZE_PX: 40,
    ROW_GAP: 20,
    SEAT_GAP: 20,
    LEGEND_GAP: 24,
    PADDING: 24,
} as const;

// Цвета для карты мест
export const SEAT_COLORS = {
    AVAILABLE_BACKGROUND: 'transparent',
    AVAILABLE_BORDER: '#616161',
    SELECTED_BACKGROUND: '#64B5F6',
    SELECTED_BORDER: '#64B5F6',
    BOOKED_BACKGROUND: '#E57373',
    BOOKED_BORDER: '#E57373',
    TEXT_COLOR: '#999',
    LEGEND_GAP: 8,
    LEGEND_INDICATOR_SIZE: 20,
} as const;

// Размеры элементов UI
export const UI = {
    BUTTON_MIN_WIDTH: 100,
    INPUT_HEIGHT: 50,
    BUTTON_HEIGHT: 40,
    FORM_MAX_WIDTH: 900,
} as const;

// API endpoints
export const API_ENDPOINTS = {
    LOGIN: '/api/proxy/login',
    REGISTER: '/api/proxy/register',
    MOVIES: '/api/proxy/movies',
    CINEMAS: '/api/proxy/cinemas',
    BOOKINGS: '/api/proxy/me/bookings',
    SETTINGS: '/api/proxy/settings',
} as const;

// Сообщения об ошибках
export const ERROR_MESSAGES = {
    LOGIN_FAILED: 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова',
    REGISTRATION_FAILED: 'Ошибка регистрации',
    UNAUTHORIZED: 'Необходима авторизация',
    FORBIDDEN: 'Доступ запрещен',
    NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету',
    UNKNOWN_ERROR: 'Произошла неизвестная ошибка',
    BOOKING_FAILED: 'Ошибка при бронировании мест',
    INVALID_SESSION: 'Неверный сеанс',
    INVALID_SEAT: 'Неверно выбраны места',
} as const;

// Сообщения об успехе
export const SUCCESS_MESSAGES = {
    BOOKING_CREATED: 'Места успешно забронированы!',
    BOOKING_PAID: 'Билет успешно оплачен!',
    LOGIN_SUCCESS: 'Вход выполнен успешно',
    REGISTRATION_SUCCESS: 'Регистрация выполнена успешно',
    LOGOUT_SUCCESS: 'Выход выполнен успешно',
} as const;

// Сообщения валидации
export const VALIDATION_MESSAGES = {
    USERNAME_REQUIRED: 'Имя пользователя обязательно',
    USERNAME_TOO_SHORT: 'Имя пользователя должно содержать минимум 8 символов',
    PASSWORD_REQUIRED: 'Пароль обязателен',
    PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 8 символов',
    PASSWORD_NO_UPPERCASE: 'Пароль должен содержать минимум 1 заглавную букву',
    PASSWORD_NO_NUMBER: 'Пароль должен содержать минимум 1 цифру',
    PASSWORD_CONFIRMATION_REQUIRED: 'Подтверждение пароля обязательно',
    PASSWORDS_DONT_MATCH: 'Пароли не совпадают',
    SEATS_NOT_SELECTED: 'Выберите места для бронирования',
    SEAT_ROW_INVALID: 'Ряд {row} не существует в этом зале',
    SEAT_NUMBER_INVALID: 'Место {seat} не существует в ряду {row}',
    SEAT_ALREADY_BOOKED: 'Место ряд {row}, место {seat} уже занято',
} as const;
