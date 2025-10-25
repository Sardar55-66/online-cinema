import { HTTP_STATUS } from '@/constants';

interface ApiClientConfig {
    baseUrl: string;
    defaultHeaders: Record<string, string>;
}

interface ErrorResponse {
    message?: string;
    status?: number;
}

// Глобальная функция для logout (будет установлена из AuthProvider)
let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void): void => {
    globalLogout = logoutFn;
};

interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    cache?: RequestCache;
}

const STORAGE_KEY = 'user';
const BEARER_PREFIX = 'Bearer ';

export class ApiClient {
    private config: ApiClientConfig;

    constructor(config: ApiClientConfig) {
        this.config = config;
    }

    private getAuthorizationHeader(): string | null {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (!savedUser) return null;

        try {
            const user = JSON.parse(savedUser) as { token?: string };
            return user.token ? `${BEARER_PREFIX}${user.token}` : null;
        } catch (error) {
            console.error('Failed to parse user from storage:', error);
            return null;
        }
    }

    private async makeRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
        const url = `${this.config.baseUrl}${endpoint}`;
        const headers = { ...this.config.defaultHeaders, ...options.headers };

        // Добавляем токен авторизации если он есть
        const authHeader = this.getAuthorizationHeader();
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const requestOptions: RequestInit = {
            method: options.method || 'GET',
            headers,
            cache: options.cache || 'no-store',
        };

        if (options.body) {
            requestOptions.body = JSON.stringify(options.body);
        }

        const response = await fetch(url, requestOptions);

        if (!response.ok) {
            const errorData = (await response.json().catch(() => ({}))) as ErrorResponse;

            // Проверяем на unauthorized и автоматически разлогиниваем
            if (
                response.status === HTTP_STATUS.UNAUTHORIZED ||
                response.status === HTTP_STATUS.FORBIDDEN ||
                errorData.status === HTTP_STATUS.UNAUTHORIZED ||
                errorData.status === HTTP_STATUS.FORBIDDEN ||
                errorData.message?.toLowerCase().includes('unauthorized')
            ) {
                if (globalLogout) {
                    globalLogout();
                }
            }

            throw new Error(errorData.message || `HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    async get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body });
    }

    async put<T>(endpoint: string, body?: unknown, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body });
    }

    async delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

// Создаем singleton instance для всего приложения
export const apiClient = new ApiClient({
    baseUrl: '/api/proxy',
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
});
