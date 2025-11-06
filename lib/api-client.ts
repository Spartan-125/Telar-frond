import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * API Client Configuration
 *
 * Configuración centralizada de Axios para realizar peticiones HTTP al backend.
 * Incluye interceptores para manejo de autenticación y errores.
 */

// Configuración base de la API
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
};

// Crear instancia de Axios
const apiClient: AxiosInstance = axios.create(API_CONFIG);

/**
 * Request Interceptor
 * Agrega el token de autenticación a todas las peticiones
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log de peticiones en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ [API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Maneja respuestas exitosas y errores de forma centralizada
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log de respuestas en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Log de errores
    console.error('❌ [API Error]', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Manejo de errores 401 (No autorizado)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Intentar refrescar el token
      try {
        const newToken = await refreshAuthToken();

        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar sesión y redirigir al login
        clearAuthSession();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Manejo de errores 403 (Prohibido)
    if (error.response?.status === 403) {
      console.error('🚫 Acceso denegado');
      // Puedes mostrar un toast o notificación aquí
    }

    // Manejo de errores 500 (Error del servidor)
    if (error.response?.status === 500) {
      console.error('🔥 Error del servidor');
      // Puedes mostrar un toast o notificación aquí
    }

    return Promise.reject(error);
  }
);

/**
 * Helpers para manejo de tokens
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('fashion-inventory-store');
}

async function refreshAuthToken(): Promise<string | null> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
      refreshToken,
    });

    const newToken = response.data.token;
    setAuthToken(newToken);

    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return null;
  }
}

/**
 * API Methods
 * Métodos utilitarios para realizar peticiones HTTP
 */
export const api = {
  /**
   * GET request
   */
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get<T>(url, config);
  },

  /**
   * POST request
   */
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post<T>(url, data, config);
  },

  /**
   * PUT request
   */
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put<T>(url, data, config);
  },

  /**
   * PATCH request
   */
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch<T>(url, data, config);
  },

  /**
   * DELETE request
   */
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete<T>(url, config);
  },
};

/**
 * API Endpoints
 * Definición de endpoints disponibles
 */
export const endpoints = {
  // Autenticación
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  // Inventario
  inventory: {
    list: '/inventory',
    create: '/inventory',
    update: (id: string) => `/inventory/${id}`,
    delete: (id: string) => `/inventory/${id}`,
    search: '/inventory/search',
    lowStock: '/inventory/low-stock',
  },

  // Ventas
  sales: {
    list: '/sales',
    create: '/sales',
    update: (id: string) => `/sales/${id}`,
    delete: (id: string) => `/sales/${id}`,
    metrics: '/sales/metrics',
    byPeriod: '/sales/by-period',
  },

  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    revenue: '/analytics/revenue',
    categories: '/analytics/categories',
    regions: '/analytics/regions',
    trends: '/analytics/trends',
  },

  // Reportes
  reports: {
    generate: '/reports/generate',
    download: (id: string) => `/reports/${id}/download`,
    list: '/reports',
  },

  // Archivos
  files: {
    upload: '/files/upload',
    download: (id: string) => `/files/${id}/download`,
  },
};

// Exportar cliente de Axios por defecto
export default apiClient;

// Exportar helpers de autenticación
export { setAuthToken, clearAuthSession };
