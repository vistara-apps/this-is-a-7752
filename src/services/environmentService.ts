/**
 * Environment Service
 * 
 * This service provides business logic for environment template-related operations,
 * including compatibility checking and recommendations.
 */

import { API } from '../api';
import { 
  EnvironmentTemplate, 
  GPUProvider,
  ApiResponse
} from '../types';

/**
 * Checks if an environment template is compatible with a specific GPU
 * 
 * @param template - Environment template to check
 * @param gpu - GPU to check compatibility with
 * @returns Boolean indicating compatibility
 */
export function isEnvironmentCompatible(
  template: EnvironmentTemplate,
  gpu: GPUProvider
): boolean {
  // If template has no compatibility restrictions, assume it's compatible
  if (!template.compatibleGPUs || template.compatibleGPUs.length === 0) {
    return true;
  }
  
  // Check if GPU type is in the compatible list
  if (template.compatibleGPUs.includes(gpu.gpuType)) {
    return true;
  }
  
  // Check if GPU architecture is in the compatible list
  if (template.compatibleGPUs.includes(gpu.specifications.architecture)) {
    return true;
  }
  
  return false;
}

/**
 * Gets recommended environment templates for a specific GPU and workload
 * 
 * @param gpu - GPU to get recommendations for
 * @param workloadType - Type of workload ('ai_training', 'rendering', 'inference', etc.)
 * @returns Promise with recommended environment templates
 */
export async function getRecommendedEnvironments(
  gpu: GPUProvider,
  workloadType: string
): Promise<ApiResponse<EnvironmentTemplate[]>> {
  try {
    // Fetch compatible environments for the GPU
    const response = await API.Environment.getCompatibleEnvironments(gpu.providerId);
    
    if (!response.success || !response.data) {
      return response;
    }
    
    let filteredTemplates = response.data;
    
    // Filter and sort based on workload type
    switch (workloadType.toLowerCase()) {
      case 'ai_training':
        // Filter for AI/ML frameworks
        filteredTemplates = filteredTemplates.filter(template => {
          const frameworks = template.frameworks.map(f => f.toLowerCase());
          return frameworks.some(f => 
            f.includes('tensorflow') || 
            f.includes('pytorch') || 
            f.includes('keras') ||
            f.includes('mxnet') ||
            f.includes('jax')
          );
        });
        break;
        
      case 'rendering':
        // Filter for rendering software
        filteredTemplates = filteredTemplates.filter(template => {
          const frameworks = template.frameworks.map(f => f.toLowerCase());
          return frameworks.some(f => 
            f.includes('blender') || 
            f.includes('maya') || 
            f.includes('3ds max') ||
            f.includes('cinema 4d') ||
            f.includes('unreal') ||
            f.includes('unity')
          );
        });
        break;
        
      case 'inference':
        // Filter for inference optimized frameworks
        filteredTemplates = filteredTemplates.filter(template => {
          const frameworks = template.frameworks.map(f => f.toLowerCase());
          return frameworks.some(f => 
            f.includes('tensorrt') || 
            f.includes('onnx') || 
            f.includes('triton') ||
            f.includes('openvino') ||
            f.includes('tflite')
          );
        });
        break;
        
      default:
        // No specific filtering for other workload types
    }
    
    // Sort by popularity if available
    filteredTemplates.sort((a, b) => {
      return (b.popularity || 0) - (a.popularity || 0);
    });
    
    return {
      success: true,
      data: filteredTemplates.slice(0, 3), // Return top 3 recommendations
      message: `Recommended environments for ${workloadType} on ${gpu.gpuType}`
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to get environment recommendations'
    };
  }
}

/**
 * Checks if an environment template has all required frameworks for a specific task
 * 
 * @param template - Environment template to check
 * @param requiredFrameworks - Array of required frameworks
 * @returns Object with compatibility result and missing frameworks
 */
export function checkFrameworkRequirements(
  template: EnvironmentTemplate,
  requiredFrameworks: string[]
): { isCompatible: boolean; missingFrameworks: string[] } {
  const templateFrameworks = template.frameworks.map(f => f.toLowerCase());
  const missingFrameworks: string[] = [];
  
  for (const framework of requiredFrameworks) {
    const frameworkLower = framework.toLowerCase();
    const hasFramework = templateFrameworks.some(f => f.includes(frameworkLower));
    
    if (!hasFramework) {
      missingFrameworks.push(framework);
    }
  }
  
  return {
    isCompatible: missingFrameworks.length === 0,
    missingFrameworks
  };
}

/**
 * Estimates the setup time for an environment template
 * 
 * @param template - Environment template to estimate
 * @returns Estimated setup time in minutes
 */
export function estimateEnvironmentSetupTime(template: EnvironmentTemplate): number {
  // Base setup time
  let setupTime = 5;
  
  // Add time based on number of frameworks
  setupTime += template.frameworks.length * 2;
  
  // Add time for complex frameworks
  for (const framework of template.frameworks) {
    const frameworkLower = framework.toLowerCase();
    
    if (frameworkLower.includes('tensorflow') || 
        frameworkLower.includes('pytorch') || 
        frameworkLower.includes('cuda')) {
      setupTime += 5;
    }
    
    if (frameworkLower.includes('blender') || 
        frameworkLower.includes('unreal') || 
        frameworkLower.includes('unity')) {
      setupTime += 8;
    }
  }
  
  return setupTime;
}

/**
 * Gets environment templates grouped by category
 * 
 * @returns Promise with environment templates grouped by category
 */
export async function getEnvironmentsByCategory(): Promise<ApiResponse<Record<string, EnvironmentTemplate[]>>> {
  try {
    // Fetch all environment templates
    const response = await API.Environment.getEnvironmentTemplates();
    
    if (!response.success || !response.data) {
      return response;
    }
    
    // Define categories
    const categories: Record<string, EnvironmentTemplate[]> = {
      'AI/ML': [],
      'Rendering': [],
      'Data Science': [],
      'Web Development': [],
      'Other': []
    };
    
    // Categorize templates
    for (const template of response.data) {
      const frameworks = template.frameworks.map(f => f.toLowerCase());
      
      if (frameworks.some(f => 
        f.includes('tensorflow') || 
        f.includes('pytorch') || 
        f.includes('keras') ||
        f.includes('mxnet') ||
        f.includes('jax')
      )) {
        categories['AI/ML'].push(template);
        continue;
      }
      
      if (frameworks.some(f => 
        f.includes('blender') || 
        f.includes('maya') || 
        f.includes('3ds max') ||
        f.includes('cinema 4d') ||
        f.includes('unreal') ||
        f.includes('unity')
      )) {
        categories['Rendering'].push(template);
        continue;
      }
      
      if (frameworks.some(f => 
        f.includes('jupyter') || 
        f.includes('pandas') || 
        f.includes('numpy') ||
        f.includes('r studio') ||
        f.includes('scikit')
      )) {
        categories['Data Science'].push(template);
        continue;
      }
      
      if (frameworks.some(f => 
        f.includes('node') || 
        f.includes('react') || 
        f.includes('vue') ||
        f.includes('angular') ||
        f.includes('django') ||
        f.includes('flask')
      )) {
        categories['Web Development'].push(template);
        continue;
      }
      
      categories['Other'].push(template);
    }
    
    return {
      success: true,
      data: categories,
      message: 'Environment templates grouped by category'
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to categorize environment templates'
    };
  }
}

