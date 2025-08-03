// src/services/axios.ts
import axios, { type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { useLoadingStore } from '@/stores/loadingStore';
import { useNotifications } from '@/composables/useNotifications';

// Define the ApiResponse interface based on your Laravel ApiResponse.php structure
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
    next_page_url: string | null;
    prev_page_url: string | null;
    first_page_url: string;
    last_page_url: string;
  };
}

// Extend AxiosRequestConfig to include our custom options
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  loadingMessage?: string;
  showLoading?: boolean;
  showSuccessNotification?: boolean; // New option to show success notifications
  successMessage?: string; // Custom success message
}

// Extend InternalAxiosRequestConfig for the interceptor
interface ExtendedInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  loadingMessage?: string;
  showLoading?: boolean;
  showSuccessNotification?: boolean;
  successMessage?: string;
}

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const apiVersion = import.meta.env.VITE_API_VERSION || '/api/v1';

const api = axios.create({
  baseURL: `${baseURL}${apiVersion}`,
  withCredentials: true,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add token and start loading
api.interceptors.request.use((config: ExtendedInternalAxiosRequestConfig) => {
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Start loading with custom message if enabled (default: true)
  if (config.showLoading !== false) {
    const loadingStore = useLoadingStore();
    const message = config.loadingMessage || 'Loading...';
    loadingStore.startLoading(message);
  }

  return config;
});

// Response interceptor to stop loading and handle notifications
api.interceptors.response.use(
  (response) => {
    // Stop loading on success
    const loadingStore = useLoadingStore();
    loadingStore.stopLoading();

    // Show success notification if enabled
    const config = response.config as ExtendedInternalAxiosRequestConfig;
    if (config.showSuccessNotification) {
      const notifications = useNotifications();
      const message = config.successMessage || response.data?.message || 'Operation completed successfully';
      notifications.success(message);
    }

    return response;
  },
  (error) => {
    // Stop loading on error
    const loadingStore = useLoadingStore();
    loadingStore.stopLoading();

    // Initialize notifications
    const notifications = useNotifications();

    // Global error handling for freelancer management system
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data as ApiResponse;
        const errorMessage = errorData?.message || `Error: ${status}`;

        switch (status) {
          case 401:
            // Handle unauthorized - redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            notifications.error('Session expired. Please login again.', {
              title: 'Authentication Required'
            });
            // You can use router here if needed: router.push('/login');
            break;
          
          case 403:
            // Handle forbidden access
            notifications.error('You do not have permission to perform this action.', {
              title: 'Access Denied'
            });
            break;
          
          case 404:
            // Handle not found
            notifications.error('The requested resource was not found.', {
              title: 'Not Found'
            });
            break;
          
          case 422:
            // Handle validation errors (common in Laravel)
            if (errorData?.errors) {
              notifications.validationError(errorData.errors);
            } else {
              notifications.error(errorMessage, { title: 'Validation Error' });
            }
            break;
          
          case 429:
            // Handle rate limiting
            notifications.warning('Too many requests. Please try again in a moment.', {
              title: 'Rate Limited'
            });
            break;
          
          case 500:
          case 502:
          case 503:
          case 504:
            // Handle server errors
            notifications.serverError(errorMessage);
            break;
          
          default:
            notifications.error(errorMessage);
        }
      } else if (error.request) {
        notifications.networkError();
      } else {
        notifications.error('An unexpected error occurred');
      }
    } else {
      notifications.error('An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

/**
 * Performs a GET request for fetching data
 */
export const get = async <T = any>(
  url: string,
  config?: ExtendedAxiosRequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> => {
  return api.get<ApiResponse<T>>(url, config);
};

/**
 * Performs a POST request for creating resources
 */
export const post = async <T = any>(
  url: string,
  data?: any,
  config?: ExtendedAxiosRequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> => {
  const requestConfig: ExtendedAxiosRequestConfig = {
    loadingMessage: 'Creating...',
    showSuccessNotification: true, // Auto-show success for POST requests
    ...config,
  };
  return api.post<ApiResponse<T>>(url, data, requestConfig);
};

/**
 * Performs a PUT request for updating resources (full update)
 */
export const put = async <T = any>(
  url: string,
  data?: any,
  config?: ExtendedAxiosRequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> => {
  const requestConfig: ExtendedAxiosRequestConfig = {
    loadingMessage: 'Updating...',
    showSuccessNotification: true, // Auto-show success for PUT requests
    ...config,
  };
  return api.put<ApiResponse<T>>(url, data, requestConfig);
};

/**
 * Performs a PATCH request for partial updates
 */
export const patch = async <T = any>(
  url: string,
  data?: any,
  config?: ExtendedAxiosRequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> => {
  const requestConfig: ExtendedAxiosRequestConfig = {
    loadingMessage: 'Updating...',
    showSuccessNotification: true, // Auto-show success for PATCH requests
    ...config,
  };
  return api.patch<ApiResponse<T>>(url, data, requestConfig);
};

/**
 * Performs a DELETE request for removing resources
 */
export const del = async <T = any>(
  url: string,
  config?: ExtendedAxiosRequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> => {
  const requestConfig: ExtendedAxiosRequestConfig = {
    loadingMessage: 'Deleting...',
    showSuccessNotification: true, // Auto-show success for DELETE requests
    ...config,
  };
  return api.delete<ApiResponse<T>>(url, requestConfig);
};

// Sanctum CSRF token for Laravel authentication
export const getCSRFToken = async (): Promise<void> => {
  const csrfUrl = `${baseURL}/sanctum/csrf-cookie`;
  await axios.get(csrfUrl, { withCredentials: true });
};

// Export the axios instance for direct use if needed
export { api };

export default api;