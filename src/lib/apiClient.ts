// базовый api клиент для устранения дублирования
interface ApiClientConfig {
    baseUrl: string;
    defaultHeaders: Record<string, string>;
}

// глобальная функция для logout (будет установлена из AuthProvider)
let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void) => {
    globalLogout = logoutFn;
};

interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    cache?: RequestCache;
}

export class ApiClient {
    private config: ApiClientConfig;

    constructor(config: ApiClientConfig) {
        this.config = config;
    }

    private async makeRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
        const url = `${this.config.baseUrl}${endpoint}`;
        const headers = { ...this.config.defaultHeaders, ...options.headers };

        // добавляем токен авторизации если он есть
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (user.token) {
                    headers['Authorization'] = `Bearer ${user.token}`;
                }
            } catch (error) {
                // игнорируем ошибки парсинга
            }
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
            const errorData = await response.json().catch(() => ({}));

            // проверяем на unauthorized и автоматически разлогиниваем
            if (response.status === 401 || response.status === 403 ||
                errorData.status === 401 || errorData.status === 403 ||
                errorData.message?.toLowerCase().includes('unauthorized')) {
                if (globalLogout) {
                    globalLogout();
                }
            }

            throw new Error(errorData.message || `http error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    async get<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: any, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body });
    }

    async put<T>(endpoint: string, body?: any, options: Omit<ApiRequestOptions, 'method'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body });
    }

    async delete<T>(endpoint: string, options: Omit<ApiRequestOptions, 'method' | 'body'> = {}): Promise<T> {
        return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

// создаем singleton instance для всего приложения
export const apiClient = new ApiClient({
    baseUrl: '/api/proxy',
    defaultHeaders: {
        'Content-Type': 'application/json',
    },
});
