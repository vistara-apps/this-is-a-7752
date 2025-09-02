/**
 * Environment Context
 * 
 * This context provides environment template-related state and functions throughout the application.
 * It handles environment discovery, selection, and management.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnvironmentTemplate, PaginationParams, ApiResponse } from '../types';
import { API } from '../api';

// Context interface
interface EnvironmentContextType {
  environmentTemplates: EnvironmentTemplate[];
  popularTemplates: EnvironmentTemplate[];
  selectedTemplate: EnvironmentTemplate | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationParams;
  fetchEnvironmentTemplates: (pagination?: PaginationParams) => Promise<void>;
  fetchPopularTemplates: (limit?: number) => Promise<void>;
  fetchCompatibleTemplates: (gpuId: string) => Promise<EnvironmentTemplate[]>;
  selectTemplate: (template: EnvironmentTemplate | null) => void;
  createCustomTemplate: (templateData: Partial<EnvironmentTemplate>) => Promise<boolean>;
  updateCustomTemplate: (templateId: string, templateData: Partial<EnvironmentTemplate>) => Promise<boolean>;
  deleteCustomTemplate: (templateId: string) => Promise<boolean>;
  searchTemplates: (query: string) => Promise<EnvironmentTemplate[]>;
}

// Create the context with default values
const EnvironmentContext = createContext<EnvironmentContextType>({
  environmentTemplates: [],
  popularTemplates: [],
  selectedTemplate: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 20 },
  fetchEnvironmentTemplates: async () => {},
  fetchPopularTemplates: async () => {},
  fetchCompatibleTemplates: async () => [],
  selectTemplate: () => {},
  createCustomTemplate: async () => false,
  updateCustomTemplate: async () => false,
  deleteCustomTemplate: async () => false,
  searchTemplates: async () => []
});

// Props for the EnvironmentProvider component
interface EnvironmentProviderProps {
  children: ReactNode;
}

// EnvironmentProvider component
export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({ children }) => {
  const [environmentTemplates, setEnvironmentTemplates] = useState<EnvironmentTemplate[]>([]);
  const [popularTemplates, setPopularTemplates] = useState<EnvironmentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EnvironmentTemplate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 20 });

  // Fetch all environment templates
  const fetchEnvironmentTemplates = async (paginationParams?: PaginationParams): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    // Update pagination if provided
    if (paginationParams) {
      setPagination(paginationParams);
    }
    
    // Use provided pagination or state value
    const currentPagination = paginationParams || pagination;
    
    try {
      const response = await API.Environment.getEnvironmentTemplates(currentPagination);
      
      if (response.success && response.data) {
        setEnvironmentTemplates(response.data);
      } else {
        setError(response.error || 'Failed to fetch environment templates');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch environment templates');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch popular environment templates
  const fetchPopularTemplates = async (limit: number = 5): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await API.Environment.getPopularEnvironments(limit);
      
      if (response.success && response.data) {
        setPopularTemplates(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch popular templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch environment templates compatible with a specific GPU
  const fetchCompatibleTemplates = async (gpuId: string): Promise<EnvironmentTemplate[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Environment.getCompatibleEnvironments(gpuId);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Failed to fetch compatible templates');
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch compatible templates');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Select an environment template
  const selectTemplate = (template: EnvironmentTemplate | null): void => {
    setSelectedTemplate(template);
  };

  // Create a custom environment template
  const createCustomTemplate = async (
    templateData: Partial<EnvironmentTemplate>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Environment.createCustomEnvironment(templateData);
      
      if (response.success && response.data) {
        // Refresh templates to include the new one
        await fetchEnvironmentTemplates();
        return true;
      } else {
        setError(response.error || 'Failed to create custom template');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create custom template');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a custom environment template
  const updateCustomTemplate = async (
    templateId: string,
    templateData: Partial<EnvironmentTemplate>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Environment.updateCustomEnvironment(templateId, templateData);
      
      if (response.success && response.data) {
        // Refresh templates to reflect the update
        await fetchEnvironmentTemplates();
        return true;
      } else {
        setError(response.error || 'Failed to update custom template');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update custom template');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a custom environment template
  const deleteCustomTemplate = async (templateId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Environment.deleteCustomEnvironment(templateId);
      
      if (response.success) {
        // Refresh templates to remove the deleted one
        await fetchEnvironmentTemplates();
        return true;
      } else {
        setError(response.error || 'Failed to delete custom template');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete custom template');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Search environment templates
  const searchTemplates = async (query: string): Promise<EnvironmentTemplate[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Environment.searchEnvironmentTemplates(query);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error || 'Search failed');
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchEnvironmentTemplates();
    fetchPopularTemplates();
  }, []);

  // Context value
  const value = {
    environmentTemplates,
    popularTemplates,
    selectedTemplate,
    isLoading,
    error,
    pagination,
    fetchEnvironmentTemplates,
    fetchPopularTemplates,
    fetchCompatibleTemplates,
    selectTemplate,
    createCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
    searchTemplates
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
};

// Custom hook for using the environment context
export const useEnvironment = (): EnvironmentContextType => {
  const context = useContext(EnvironmentContext);
  
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  
  return context;
};

