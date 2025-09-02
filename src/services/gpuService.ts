/**
 * GPU Service
 * 
 * This service provides business logic for GPU-related operations,
 * including discovery, filtering, and rental management.
 */

import { API } from '../api';
import { 
  GPUProvider, 
  Rental, 
  GPUFilterOptions, 
  PaginationParams,
  ApiResponse,
  UsageMetrics
} from '../types';

/**
 * Fetches available GPUs with combined results from multiple providers
 * 
 * @param filters - Optional filter criteria for GPUs
 * @param pagination - Optional pagination parameters
 * @returns Promise with combined list of available GPUs
 */
export async function getAvailableGPUs(
  filters?: GPUFilterOptions,
  pagination?: PaginationParams
): Promise<ApiResponse<GPUProvider[]>> {
  try {
    // Get GPUs from primary provider (GPU_NET)
    const primaryResponse = await API.GPU.getAvailableGPUs(filters, pagination);
    
    // If primary provider fails, try secondary provider (Render Network)
    if (!primaryResponse.success) {
      return API.GPU.getRenderNetworkGPUs(filters, pagination);
    }
    
    // If we have fewer results than requested, supplement with secondary provider
    if (primaryResponse.data && 
        pagination && 
        primaryResponse.data.length < pagination.limit) {
      
      // Calculate how many more GPUs we need
      const remainingLimit = pagination.limit - primaryResponse.data.length;
      
      // Get additional GPUs from secondary provider
      const secondaryResponse = await API.GPU.getRenderNetworkGPUs(
        filters,
        { ...pagination, limit: remainingLimit }
      );
      
      // Combine results if secondary request was successful
      if (secondaryResponse.success && secondaryResponse.data) {
        return {
          success: true,
          data: [...primaryResponse.data, ...secondaryResponse.data],
          message: 'Combined GPU results from multiple providers'
        };
      }
    }
    
    // Return primary results if secondary provider wasn't needed or failed
    return primaryResponse;
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to fetch available GPUs'
    };
  }
}

/**
 * Calculates the estimated cost for a GPU rental
 * 
 * @param gpu - GPU provider details
 * @param hours - Rental duration in hours
 * @returns Estimated cost
 */
export function calculateRentalCost(gpu: GPUProvider, hours: number): number {
  // Basic calculation: price per hour * hours
  let cost = gpu.pricePerHour * hours;
  
  // Apply volume discount for longer rentals
  if (hours >= 720) { // 30 days
    cost *= 0.8; // 20% discount
  } else if (hours >= 168) { // 7 days
    cost *= 0.9; // 10% discount
  } else if (hours >= 24) { // 1 day
    cost *= 0.95; // 5% discount
  }
  
  return parseFloat(cost.toFixed(2));
}

/**
 * Recommends GPUs based on workload type
 * 
 * @param workloadType - Type of workload ('ai_training', 'rendering', 'inference', etc.)
 * @param budget - Optional maximum budget per hour
 * @returns Promise with recommended GPUs
 */
export async function getRecommendedGPUs(
  workloadType: string,
  budget?: number
): Promise<ApiResponse<GPUProvider[]>> {
  try {
    // Fetch all available GPUs
    const response = await API.GPU.getAvailableGPUs();
    
    if (!response.success || !response.data) {
      return response;
    }
    
    let filteredGPUs = response.data;
    
    // Apply budget filter if provided
    if (budget !== undefined) {
      filteredGPUs = filteredGPUs.filter(gpu => gpu.pricePerHour <= budget);
    }
    
    // Sort and filter based on workload type
    switch (workloadType.toLowerCase()) {
      case 'ai_training':
        // For AI training, prioritize GPUs with more memory and newer architecture
        filteredGPUs.sort((a, b) => {
          // First compare memory
          if (a.specifications.memory !== b.specifications.memory) {
            return b.specifications.memory - a.specifications.memory;
          }
          // Then compare performance score
          return (b.specifications.performanceScore || 0) - (a.specifications.performanceScore || 0);
        });
        break;
        
      case 'rendering':
        // For rendering, prioritize GPUs with higher core count and clock speed
        filteredGPUs.sort((a, b) => {
          // First compare cores
          if (a.specifications.cores !== b.specifications.cores) {
            return b.specifications.cores - a.specifications.cores;
          }
          // Then compare clock speed
          return b.specifications.clockSpeed - a.specifications.clockSpeed;
        });
        break;
        
      case 'inference':
        // For inference, balance between performance and cost
        filteredGPUs.sort((a, b) => {
          const aRatio = (a.specifications.performanceScore || 0) / a.pricePerHour;
          const bRatio = (b.specifications.performanceScore || 0) / b.pricePerHour;
          return bRatio - aRatio;
        });
        break;
        
      default:
        // Default sorting by price
        filteredGPUs.sort((a, b) => a.pricePerHour - b.pricePerHour);
    }
    
    return {
      success: true,
      data: filteredGPUs.slice(0, 5), // Return top 5 recommendations
      message: `Recommended GPUs for ${workloadType}`
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to get GPU recommendations'
    };
  }
}

/**
 * Analyzes GPU usage metrics to provide optimization recommendations
 * 
 * @param metrics - GPU usage metrics
 * @returns Optimization recommendations
 */
export function analyzeGPUUsage(metrics: UsageMetrics): {
  isOptimal: boolean;
  recommendations: string[];
  utilizationScore: number;
} {
  const recommendations: string[] = [];
  let utilizationScore = 0;
  
  // Calculate average GPU utilization
  const avgGPUUtilization = metrics.metrics.reduce((sum, metricSet) => {
    return sum + metricSet[2]; // Assuming index 2 is GPU utilization
  }, 0) / metrics.metrics.length;
  
  // Calculate average memory usage
  const avgMemoryUsage = metrics.metrics.reduce((sum, metricSet) => {
    return sum + metricSet[1]; // Assuming index 1 is memory usage
  }, 0) / metrics.metrics.length;
  
  // Calculate utilization score (0-100)
  utilizationScore = Math.round((avgGPUUtilization + avgMemoryUsage) / 2);
  
  // Generate recommendations based on metrics
  if (avgGPUUtilization < 30) {
    recommendations.push('GPU utilization is low. Consider using a less powerful GPU to reduce costs.');
  }
  
  if (avgGPUUtilization > 95) {
    recommendations.push('GPU is consistently at maximum capacity. Consider upgrading to a more powerful GPU for better performance.');
  }
  
  if (avgMemoryUsage > 90) {
    recommendations.push('GPU memory usage is very high. Consider a GPU with more memory to avoid out-of-memory errors.');
  }
  
  if (avgMemoryUsage < 20 && metrics.memoryUsage > 16) {
    recommendations.push('GPU memory is underutilized. Consider a GPU with less memory to reduce costs.');
  }
  
  // Check for spikes in utilization
  let hasSpikes = false;
  for (let i = 1; i < metrics.metrics.length; i++) {
    if (Math.abs(metrics.metrics[i][2] - metrics.metrics[i-1][2]) > 50) {
      hasSpikes = true;
      break;
    }
  }
  
  if (hasSpikes) {
    recommendations.push('GPU utilization shows significant spikes. Consider optimizing your workload for more consistent performance.');
  }
  
  // Determine if current setup is optimal
  const isOptimal = utilizationScore >= 70 && utilizationScore <= 90 && !hasSpikes;
  
  if (isOptimal && recommendations.length === 0) {
    recommendations.push('Your GPU utilization is optimal. No changes recommended.');
  }
  
  return {
    isOptimal,
    recommendations,
    utilizationScore
  };
}

/**
 * Estimates time remaining for a rental based on progress and metrics
 * 
 * @param rental - Rental details
 * @param progressPercentage - Current progress percentage (0-100)
 * @param metrics - Recent usage metrics
 * @returns Estimated time remaining in minutes
 */
export function estimateRemainingTime(
  rental: Rental,
  progressPercentage: number,
  metrics: UsageMetrics
): number {
  if (progressPercentage >= 100) {
    return 0;
  }
  
  // Calculate time elapsed so far
  const startTime = new Date(rental.startTime).getTime();
  const currentTime = new Date().getTime();
  const elapsedMinutes = (currentTime - startTime) / (1000 * 60);
  
  // Calculate estimated total time based on progress
  const estimatedTotalMinutes = (elapsedMinutes / progressPercentage) * 100;
  
  // Calculate remaining time
  let remainingMinutes = estimatedTotalMinutes - elapsedMinutes;
  
  // Adjust based on recent GPU utilization trend
  if (metrics.metrics.length >= 5) {
    // Get recent utilization trend (last 5 data points)
    const recentMetrics = metrics.metrics.slice(-5);
    const utilizationTrend = recentMetrics.map(metric => metric[2]); // Assuming index 2 is GPU utilization
    
    // Calculate if utilization is increasing or decreasing
    let trendSum = 0;
    for (let i = 1; i < utilizationTrend.length; i++) {
      trendSum += utilizationTrend[i] - utilizationTrend[i-1];
    }
    
    // Adjust remaining time based on trend
    if (trendSum > 10) {
      // Utilization increasing (slowing down) - add 10%
      remainingMinutes *= 1.1;
    } else if (trendSum < -10) {
      // Utilization decreasing (speeding up) - subtract 10%
      remainingMinutes *= 0.9;
    }
  }
  
  return Math.max(0, Math.round(remainingMinutes));
}

