/**
 * API Client for GPU Forge
 * 
 * This file provides a configured Axios instance for making API requests
 * with proper error handling, authentication, and request/response interceptors.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_URLS, API_KEYS, REQUEST_TIMEOUT, MAX_RETRIES } from './config';
import { ApiResponse } from '../types';

// Create a map of API clients for different services
const apiClients: Record<string, AxiosInstance> = {};

/**
 * Creates and configures an Axios instance for a specific API service
 * 
 * @param serviceName - The name of the API service (e.g., 'GPU_NET', 'SUPABASE')
 * @returns Configured Axios instance
 */
export const createApiClient = (serviceName: keyof typeof API_URLS): AxiosInstance => {
  // Return existing client if already created
  if (apiClients[serviceName]) {
    return apiClients[serviceName];
  }

  const baseURL = API_URLS[serviceName];
  const apiKey = API_KEYS[serviceName];

  // Create new Axios instance with base configuration
  const client = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
    }
  });

  // Request interceptor for adding auth headers and handling request configuration
  client.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // Add service-specific headers or authentication
      if (serviceName === 'SUPABASE') {
        config.headers = {
          ...config.headers,
          'apikey': API_KEYS.SUPABASE,
          'Prefer': 'return=representation'
        };
      } else if (serviceName === 'STRIPE') {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${API_KEYS.STRIPE}`
        };
      }
      
      // Get auth token from local storage for authenticated requests
      const token = localStorage.getItem('authToken');
      if (token && !config.headers?.Authorization) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`
        };
      }
      
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor for handling common response patterns and errors
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Transform response data if needed
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      // Handle token expiration and refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Attempt to refresh token logic would go here
          // const refreshedToken = await refreshToken();
          // localStorage.setItem('authToken', refreshedToken);
          // originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
          // return client(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure (e.g., redirect to login)
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Implement retry logic for failed requests
      if (originalRequest._retryCount === undefined) {
        originalRequest._retryCount = 0;
      }
      
      if (originalRequest._retryCount < MAX_RETRIES && 
          error.response?.status >= 500) {
        originalRequest._retryCount++;
        
        // Exponential backoff delay
        const delay = Math.pow(2, originalRequest._retryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return client(originalRequest);
      }
      
      // Format error response
      return Promise.reject({
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        originalError: error
      });
    }
  );

  // Store the client instance
  apiClients[serviceName] = client;
  
  return client;
};

/**
 * Generic API request function with proper typing
 * 
 * @param serviceName - The API service to use
 * @param method - HTTP method
 * @param endpoint - API endpoint
 * @param data - Request payload (for POST, PUT, PATCH)
 * @param params - URL query parameters
 * @returns Promise with typed response
 */
export async function apiRequest<T>(
  serviceName: keyof typeof API_URLS,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any,
  params?: any
): Promise<ApiResponse<T>> {
  try {
    const client = createApiClient(serviceName);
    
    const response = await client({
      method,
      url: endpoint,
      data,
      params
    });
    
    return {
      success: true,
      data: response.data,
      message: 'Request successful'
    };
  } catch (error: any) {
    console.error(`API Error (${serviceName} - ${endpoint}):`, error);
    
    return {
      success: false,
      error: error.message || 'An unknown error occurred',
      message: error.data?.message || 'Request failed'
    };
  }
}

// Export pre-configured clients for common services
export const gpuNetClient = createApiClient('GPU_NET');
export const renderNetworkClient = createApiClient('RENDER_NETWORK');
export const turnkeyClient = createApiClient('TURNKEY');
export const privyClient = createApiClient('PRIVY');
export const supabaseClient = createApiClient('SUPABASE');
export const stripeClient = createApiClient('STRIPE');

