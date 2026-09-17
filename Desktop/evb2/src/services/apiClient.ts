export interface ApiErrorDetail {
  message: string;
  field?: string;
  documentId?: string;
  clientVersion?: number;
  serverVersion?: number;
}

export class ApiError extends Error {
  status: number;
  errors: ApiErrorDetail[];

  constructor(status: number, errors: ApiErrorDetail[]) {
    const firstMessage = errors[0]?.message || `HTTP Request failed with status ${status}`;
    super(firstMessage);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const API_BASE_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'docflow_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const errors = data.errors || [{ message: data.message || `Request failed with status ${response.status}` }];
    throw new ApiError(response.status, errors);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
