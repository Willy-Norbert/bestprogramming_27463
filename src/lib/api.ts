import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true, // Important for HttpOnly cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to attach token if available
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Token is handled via HttpOnly cookie, but we can add Authorization header as fallback
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('📤 [API] Request with token:', config.url);
        } else {
          console.log('📤 [API] Request without token:', config.url);
        }
        return config;
      },
      (error) => {
        console.error('❌ [API] Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ [API] Response received:', response.config.url, response.status);
        return response;
      },
      async (error) => {
        // Only handle network errors or actual HTTP errors
        if (error.response) {
          // HTTP error response
          console.error('❌ [API] HTTP Error:', {
            url: error.config?.url,
            status: error.response.status,
            message: error.response.data?.message || error.message
          });
          if (error.response.status === 401) {
            console.log('🔒 [API] 401 Unauthorized - clearing auth token');
            // Unauthorized - clear auth state
            localStorage.removeItem('auth_token');
            // Redirect to login will be handled by ProtectedRoute
          }
        } else if (error.request) {
          // Request made but no response (network error)
          console.error('❌ [API] Network error - no response received:', error.message);
          console.error('❌ [API] Request config:', error.config?.url);
        } else {
          // Something else happened
          console.error('❌ [API] Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  patch(url: string, data?: any, config?: any) {
    return this.client.patch(url, data, config);
  }

  delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();

