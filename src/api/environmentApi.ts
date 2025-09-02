/**
 * Environment API Service
 * 
 * This file contains functions for interacting with environment template APIs,
 * including fetching available templates and managing environment configurations.
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';
import { 
  EnvironmentTemplate,
  PaginationParams,
  ApiResponse
} from '../types';

/**
 * Fetches all available environment templates
 * 
 * @param pagination - Optional pagination parameters
 * @returns Promise with list of environment templates
 */
export async function getEnvironmentTemplates(
  pagination?: PaginationParams
): Promise<ApiResponse<EnvironmentTemplate[]>> {
  return apiRequest<EnvironmentTemplate[]>(
    'SUPABASE',
    'GET',
    ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES,
    undefined,
    {
      page: pagination?.page || 1,
      limit: pagination?.limit || 20
    }
  );
}

/**
 * Fetches details for a specific environment template
 * 
 * @param templateId - ID of the template to retrieve
 * @returns Promise with environment template details
 */
export async function getEnvironmentTemplateDetails(
  templateId: string
): Promise<ApiResponse<EnvironmentTemplate>> {
  return apiRequest<EnvironmentTemplate>(
    'SUPABASE',
    'GET',
    `${ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES}/${templateId}`
  );
}

/**
 * Fetches environment templates compatible with a specific GPU
 * 
 * @param gpuId - ID of the GPU to check compatibility
 * @returns Promise with list of compatible environment templates
 */
export async function getCompatibleEnvironments(
  gpuId: string
): Promise<ApiResponse<EnvironmentTemplate[]>> {
  return apiRequest<EnvironmentTemplate[]>(
    'SUPABASE',
    'GET',
    `${ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES}/compatible`,
    undefined,
    { gpuId }
  );
}

/**
 * Creates a custom environment template
 * 
 * @param templateData - Environment template data
 * @returns Promise with created environment template
 */
export async function createCustomEnvironment(
  templateData: Partial<EnvironmentTemplate>
): Promise<ApiResponse<EnvironmentTemplate>> {
  return apiRequest<EnvironmentTemplate>(
    'SUPABASE',
    'POST',
    ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES,
    templateData
  );
}

/**
 * Updates an existing custom environment template
 * 
 * @param templateId - ID of the template to update
 * @param templateData - Updated environment template data
 * @returns Promise with updated environment template
 */
export async function updateCustomEnvironment(
  templateId: string,
  templateData: Partial<EnvironmentTemplate>
): Promise<ApiResponse<EnvironmentTemplate>> {
  return apiRequest<EnvironmentTemplate>(
    'SUPABASE',
    'PATCH',
    `${ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES}/${templateId}`,
    templateData
  );
}

/**
 * Deletes a custom environment template
 * 
 * @param templateId - ID of the template to delete
 * @returns Promise with deletion result
 */
export async function deleteCustomEnvironment(
  templateId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    'SUPABASE',
    'DELETE',
    `${ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES}/${templateId}`
  );
}

/**
 * Fetches popular environment templates based on usage
 * 
 * @param limit - Maximum number of templates to return
 * @returns Promise with list of popular environment templates
 */
export async function getPopularEnvironments(
  limit: number = 5
): Promise<ApiResponse<EnvironmentTemplate[]>> {
  return apiRequest<EnvironmentTemplate[]>(
    'SUPABASE',
    'GET',
    `${ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES}/popular`,
    undefined,
    { limit }
  );
}

/**
 * Searches environment templates by name or framework
 * 
 * @param query - Search query string
 * @param pagination - Optional pagination parameters
 * @returns Promise with list of matching environment templates
 */
export async function searchEnvironmentTemplates(
  query: string,
  pagination?: PaginationParams
): Promise<ApiResponse<EnvironmentTemplate[]>> {
  return apiRequest<EnvironmentTemplate[]>(
    'SUPABASE',
    'GET',
    `${ENDPOINTS.SUPABASE.ENVIRONMENT_TEMPLATES}/search`,
    undefined,
    {
      query,
      page: pagination?.page || 1,
      limit: pagination?.limit || 10
    }
  );
}

