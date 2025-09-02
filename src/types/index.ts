// Type definitions for GPU Forge application

// User entity
export interface User {
  userId: string;
  email: string;
  paymentInfo?: PaymentInfo;
  rentalHistory?: Rental[];
}

// Payment information
export interface PaymentInfo {
  id: string;
  type: 'wallet' | 'card';
  details: string; // Wallet address or masked card number
  default: boolean;
}

// GPU Provider entity
export interface GPUProvider {
  providerId: string;
  name: string;
  gpuType: string;
  specifications: GPUSpecifications;
  availability: boolean;
  pricePerHour: number;
  location: string;
  imageUrl?: string;
}

// GPU Specifications
export interface GPUSpecifications {
  model: string;
  memory: number; // in GB
  cores: number;
  clockSpeed: number; // in MHz
  architecture: string;
  performanceScore?: number;
}

// Rental entity
export interface Rental {
  rentalId: string;
  userId: string;
  gpuId: string;
  gpuDetails?: GPUProvider;
  environmentId?: string;
  environmentDetails?: EnvironmentTemplate;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  status: RentalStatus;
  cost: number;
  usageMetrics?: UsageMetrics;
}

// Rental status enum
export type RentalStatus = 'pending' | 'active' | 'completed' | 'cancelled' | 'failed';

// Environment Template entity
export interface EnvironmentTemplate {
  templateId: string;
  name: string;
  description: string;
  frameworks: string[];
  imageUrl?: string;
  popularity?: number;
  compatibleGPUs?: string[]; // Array of GPU types this environment works with
}

// Usage metrics for monitoring GPU performance
export interface UsageMetrics {
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  gpuUtilization: number; // percentage
  networkUsage: number; // in Mbps
  diskUsage: number; // in GB
  timestamps: string[]; // Array of ISO date strings for time series data
  metrics: number[][]; // Array of metric arrays corresponding to timestamps
}

// Dashboard statistics
export interface DashboardStats {
  activeRentals: number;
  totalSpent: number;
  availableGPUs: number;
  averageUtilization: number;
}

// Filter options for GPU marketplace
export interface GPUFilterOptions {
  minMemory?: number;
  maxPrice?: number;
  gpuTypes?: string[];
  availability?: boolean;
  location?: string[];
  sortBy?: 'price' | 'performance' | 'availability';
  sortDirection?: 'asc' | 'desc';
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

// Payment transaction
export interface PaymentTransaction {
  transactionId: string;
  userId: string;
  rentalId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  paymentMethod: string;
  receiptUrl?: string;
}

// Authentication types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

