/**
 * API Services Index
 * 
 * This file exports all API services for easy importing throughout the application.
 */

// Export API configuration
export * from './config';

// Export API client
export * from './client';

// Export API services
export * from './gpuApi';
export * from './environmentApi';
export * from './authApi';
export * from './paymentApi';

// Export combined API interface for convenience
import * as GpuApi from './gpuApi';
import * as EnvironmentApi from './environmentApi';
import * as AuthApi from './authApi';
import * as PaymentApi from './paymentApi';

export const API = {
  GPU: GpuApi,
  Environment: EnvironmentApi,
  Auth: AuthApi,
  Payment: PaymentApi
};

