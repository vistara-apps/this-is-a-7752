/**
 * GPU API Service
 * 
 * This file contains functions for interacting with GPU-related APIs,
 * including GPU discovery, rental management, and usage monitoring.
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';
import { 
  GPUProvider, 
  Rental, 
  GPUFilterOptions, 
  PaginationParams,
  ApiResponse,
  UsageMetrics
} from '../types';

/**
 * Fetches available GPUs with optional filtering and pagination
 * 
 * @param filters - Optional filter criteria for GPUs
 * @param pagination - Optional pagination parameters
 * @returns Promise with list of available GPUs
 */
export async function getAvailableGPUs(
  filters?: GPUFilterOptions,
  pagination?: PaginationParams
): Promise<ApiResponse<GPUProvider[]>> {
  return apiRequest<GPUProvider[]>(
    'GPU_NET',
    'GET',
    ENDPOINTS.GPU_NET.AVAILABLE_GPUS,
    undefined,
    {
      ...filters,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10
    }
  );
}

/**
 * Fetches alternative GPU providers from Render Network
 * 
 * @param filters - Optional filter criteria for GPUs
 * @param pagination - Optional pagination parameters
 * @returns Promise with list of available GPUs from Render Network
 */
export async function getRenderNetworkGPUs(
  filters?: GPUFilterOptions,
  pagination?: PaginationParams
): Promise<ApiResponse<GPUProvider[]>> {
  return apiRequest<GPUProvider[]>(
    'RENDER_NETWORK',
    'GET',
    ENDPOINTS.RENDER_NETWORK.GPU_RESOURCES,
    undefined,
    {
      ...filters,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10
    }
  );
}

/**
 * Creates a new GPU rental
 * 
 * @param gpuId - ID of the GPU to rent
 * @param duration - Rental duration in hours
 * @param environmentId - Optional environment template ID
 * @returns Promise with created rental details
 */
export async function createGPURental(
  gpuId: string,
  duration: number,
  environmentId?: string
): Promise<ApiResponse<Rental>> {
  return apiRequest<Rental>(
    'GPU_NET',
    'POST',
    ENDPOINTS.GPU_NET.CREATE_RENTAL,
    {
      gpuId,
      duration,
      environmentId
    }
  );
}

/**
 * Gets details of a specific rental
 * 
 * @param rentalId - ID of the rental to retrieve
 * @returns Promise with rental details
 */
export async function getRentalDetails(rentalId: string): Promise<ApiResponse<Rental>> {
  return apiRequest<Rental>(
    'GPU_NET',
    'GET',
    `${ENDPOINTS.GPU_NET.RENTAL_STATUS}/${rentalId}`
  );
}

/**
 * Gets all rentals for the current user
 * 
 * @param status - Optional filter by rental status
 * @param pagination - Optional pagination parameters
 * @returns Promise with list of user's rentals
 */
export async function getUserRentals(
  status?: string,
  pagination?: PaginationParams
): Promise<ApiResponse<Rental[]>> {
  return apiRequest<Rental[]>(
    'SUPABASE',
    'GET',
    ENDPOINTS.SUPABASE.RENTALS,
    undefined,
    {
      status,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10
    }
  );
}

/**
 * Terminates an active rental
 * 
 * @param rentalId - ID of the rental to terminate
 * @returns Promise with termination result
 */
export async function terminateRental(rentalId: string): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    'GPU_NET',
    'POST',
    ENDPOINTS.GPU_NET.TERMINATE_RENTAL,
    { rentalId }
  );
}

/**
 * Extends an active rental
 * 
 * @param rentalId - ID of the rental to extend
 * @param additionalHours - Number of hours to extend the rental
 * @returns Promise with updated rental details
 */
export async function extendRental(
  rentalId: string,
  additionalHours: number
): Promise<ApiResponse<Rental>> {
  return apiRequest<Rental>(
    'GPU_NET',
    'POST',
    `${ENDPOINTS.GPU_NET.RENTAL_STATUS}/${rentalId}/extend`,
    { additionalHours }
  );
}

/**
 * Gets usage metrics for a specific rental
 * 
 * @param rentalId - ID of the rental to get metrics for
 * @param timeRange - Optional time range in minutes (defaults to last 60 minutes)
 * @returns Promise with usage metrics
 */
export async function getRentalUsageMetrics(
  rentalId: string,
  timeRange?: number
): Promise<ApiResponse<UsageMetrics>> {
  return apiRequest<UsageMetrics>(
    'GPU_NET',
    'GET',
    `${ENDPOINTS.GPU_NET.RENTAL_STATUS}/${rentalId}/metrics`,
    undefined,
    { timeRange: timeRange || 60 }
  );
}

/**
 * Gets detailed specifications for a specific GPU
 * 
 * @param gpuId - ID of the GPU to get details for
 * @returns Promise with detailed GPU specifications
 */
export async function getGPUDetails(gpuId: string): Promise<ApiResponse<GPUProvider>> {
  return apiRequest<GPUProvider>(
    'GPU_NET',
    'GET',
    `${ENDPOINTS.GPU_NET.AVAILABLE_GPUS}/${gpuId}`
  );
}

/**
 * Checks if a specific GPU is currently available for rental
 * 
 * @param gpuId - ID of the GPU to check availability
 * @returns Promise with availability status
 */
export async function checkGPUAvailability(
  gpuId: string
): Promise<ApiResponse<{ available: boolean, nextAvailableTime?: string }>> {
  return apiRequest<{ available: boolean, nextAvailableTime?: string }>(
    'GPU_NET',
    'GET',
    `${ENDPOINTS.GPU_NET.AVAILABLE_GPUS}/${gpuId}/availability`
  );
}

