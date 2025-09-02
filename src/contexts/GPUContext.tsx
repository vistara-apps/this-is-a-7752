/**
 * GPU Context
 * 
 * This context provides GPU-related state and functions throughout the application.
 * It handles GPU discovery, filtering, and rental management.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GPUProvider, Rental, GPUFilterOptions, PaginationParams, ApiResponse } from '../types';
import { API } from '../api';
import { useAuth } from './AuthContext';

// Context interface
interface GPUContextType {
  availableGPUs: GPUProvider[];
  userRentals: Rental[];
  activeRentals: Rental[];
  selectedGPU: GPUProvider | null;
  isLoading: boolean;
  error: string | null;
  totalGPUs: number;
  pagination: PaginationParams;
  filterOptions: GPUFilterOptions;
  fetchAvailableGPUs: (filters?: GPUFilterOptions, pagination?: PaginationParams) => Promise<void>;
  fetchUserRentals: () => Promise<void>;
  selectGPU: (gpu: GPUProvider | null) => void;
  createRental: (gpuId: string, duration: number, environmentId?: string) => Promise<ApiResponse<Rental>>;
  terminateRental: (rentalId: string) => Promise<boolean>;
  extendRental: (rentalId: string, additionalHours: number) => Promise<boolean>;
  setFilterOptions: (filters: GPUFilterOptions) => void;
  setPagination: (pagination: PaginationParams) => void;
}

// Create the context with default values
const GPUContext = createContext<GPUContextType>({
  availableGPUs: [],
  userRentals: [],
  activeRentals: [],
  selectedGPU: null,
  isLoading: false,
  error: null,
  totalGPUs: 0,
  pagination: { page: 1, limit: 10 },
  filterOptions: {},
  fetchAvailableGPUs: async () => {},
  fetchUserRentals: async () => {},
  selectGPU: () => {},
  createRental: async () => ({ success: false }),
  terminateRental: async () => false,
  extendRental: async () => false,
  setFilterOptions: () => {},
  setPagination: () => {}
});

// Props for the GPUProvider component
interface GPUProviderProps {
  children: ReactNode;
}

// GPUProvider component
export const GPUProvider: React.FC<GPUProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [availableGPUs, setAvailableGPUs] = useState<GPUProvider[]>([]);
  const [userRentals, setUserRentals] = useState<Rental[]>([]);
  const [activeRentals, setActiveRentals] = useState<Rental[]>([]);
  const [selectedGPU, setSelectedGPU] = useState<GPUProvider | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalGPUs, setTotalGPUs] = useState<number>(0);
  const [pagination, setPaginationState] = useState<PaginationParams>({ page: 1, limit: 10 });
  const [filterOptions, setFilterOptionsState] = useState<GPUFilterOptions>({});

  // Fetch available GPUs
  const fetchAvailableGPUs = async (
    filters?: GPUFilterOptions,
    paginationParams?: PaginationParams
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    // Update state with new filters and pagination if provided
    if (filters) {
      setFilterOptionsState(filters);
    }
    
    if (paginationParams) {
      setPaginationState(paginationParams);
    }
    
    // Use provided params or state values
    const currentFilters = filters || filterOptions;
    const currentPagination = paginationParams || pagination;
    
    try {
      const response = await API.GPU.getAvailableGPUs(currentFilters, currentPagination);
      
      if (response.success && response.data) {
        setAvailableGPUs(response.data);
        
        // Update total count if provided in response
        if (response.data.length > 0 && 'total' in currentPagination) {
          setTotalGPUs(currentPagination.total || 0);
        }
      } else {
        setError(response.error || 'Failed to fetch GPUs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GPUs');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user rentals
  const fetchUserRentals = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    
    try {
      const response = await API.GPU.getUserRentals();
      
      if (response.success && response.data) {
        setUserRentals(response.data);
        
        // Filter active rentals
        const active = response.data.filter(rental => rental.status === 'active');
        setActiveRentals(active);
      }
    } catch (err) {
      console.error('Failed to fetch user rentals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a GPU
  const selectGPU = (gpu: GPUProvider | null): void => {
    setSelectedGPU(gpu);
  };

  // Create a rental
  const createRental = async (
    gpuId: string,
    duration: number,
    environmentId?: string
  ): Promise<ApiResponse<Rental>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.GPU.createGPURental(gpuId, duration, environmentId);
      
      if (response.success) {
        // Refresh user rentals to include the new rental
        await fetchUserRentals();
      } else {
        setError(response.error || 'Failed to create rental');
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create rental');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Terminate a rental
  const terminateRental = async (rentalId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.GPU.terminateRental(rentalId);
      
      if (response.success) {
        // Refresh user rentals to reflect the terminated rental
        await fetchUserRentals();
        return true;
      } else {
        setError(response.error || 'Failed to terminate rental');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to terminate rental');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Extend a rental
  const extendRental = async (rentalId: string, additionalHours: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.GPU.extendRental(rentalId, additionalHours);
      
      if (response.success) {
        // Refresh user rentals to reflect the extended rental
        await fetchUserRentals();
        return true;
      } else {
        setError(response.error || 'Failed to extend rental');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to extend rental');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Set filter options
  const setFilterOptions = (filters: GPUFilterOptions): void => {
    setFilterOptionsState(filters);
    // Reset to first page when filters change
    setPaginationState({ ...pagination, page: 1 });
  };

  // Set pagination
  const setPagination = (paginationParams: PaginationParams): void => {
    setPaginationState(paginationParams);
  };

  // Load initial data
  useEffect(() => {
    fetchAvailableGPUs();
  }, []);

  // Fetch user rentals when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRentals();
    } else {
      setUserRentals([]);
      setActiveRentals([]);
    }
  }, [isAuthenticated]);

  // Context value
  const value = {
    availableGPUs,
    userRentals,
    activeRentals,
    selectedGPU,
    isLoading,
    error,
    totalGPUs,
    pagination,
    filterOptions,
    fetchAvailableGPUs,
    fetchUserRentals,
    selectGPU,
    createRental,
    terminateRental,
    extendRental,
    setFilterOptions,
    setPagination
  };

  return (
    <GPUContext.Provider value={value}>
      {children}
    </GPUContext.Provider>
  );
};

// Custom hook for using the GPU context
export const useGPU = (): GPUContextType => {
  const context = useContext(GPUContext);
  
  if (context === undefined) {
    throw new Error('useGPU must be used within a GPUProvider');
  }
  
  return context;
};

