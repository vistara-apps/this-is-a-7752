/**
 * API Configuration for GPU Forge
 * 
 * This file contains configuration for all external API services used by the application.
 */

// Base API URLs
export const API_URLS = {
  // GPU Network API for discovering and renting GPUs
  GPU_NET: 'https://api.gpu.net/v1',
  
  // Render Network API for rendering jobs and GPU resources
  RENDER_NETWORK: 'https://api.rendertoken.com/v1',
  
  // Turnkey API for wallet management and payments
  TURNKEY: 'https://api.turnkey.tech/v1',
  
  // Privy API for authentication and identity management
  PRIVY: 'https://api.privy.io/v1',
  
  // Base RPC endpoint for blockchain interactions
  BASE_RPC: 'https://mainnet.base.org',
  
  // Supabase API for database operations
  SUPABASE: process.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co/rest/v1',
  
  // Stripe API for fiat payments
  STRIPE: 'https://api.stripe.com/v1'
};

// API Keys and Authentication
export const API_KEYS = {
  GPU_NET: process.env.VITE_GPU_NET_API_KEY,
  RENDER_NETWORK: process.env.VITE_RENDER_NETWORK_API_KEY,
  TURNKEY: process.env.VITE_TURNKEY_API_KEY,
  PRIVY: process.env.VITE_PRIVY_API_KEY,
  BASE_RPC: process.env.VITE_BASE_RPC_API_KEY,
  SUPABASE: process.env.VITE_SUPABASE_API_KEY,
  STRIPE: process.env.VITE_STRIPE_API_KEY
};

// API Endpoints
export const ENDPOINTS = {
  // GPU Network endpoints
  GPU_NET: {
    AVAILABLE_GPUS: '/gpus/available',
    CREATE_RENTAL: '/rentals/create',
    RENTAL_STATUS: '/rentals/status',
    TERMINATE_RENTAL: '/rentals/terminate'
  },
  
  // Render Network endpoints
  RENDER_NETWORK: {
    GPU_RESOURCES: '/gpu-resources',
    CREATE_JOB: '/jobs/create',
    JOB_STATUS: '/jobs/status',
    CANCEL_JOB: '/jobs/cancel'
  },
  
  // Turnkey endpoints
  TURNKEY: {
    CREATE_WALLET: '/wallets/create',
    INITIATE_PAYMENT: '/payments/initiate',
    PAYMENT_STATUS: '/payments/status'
  },
  
  // Privy endpoints
  PRIVY: {
    LOGIN: '/auth/login',
    LINK_WALLET: '/wallets/link',
    USER_PROFILE: '/users/profile'
  },
  
  // Supabase tables
  SUPABASE: {
    USERS: 'users',
    GPU_PROVIDERS: 'gpu_providers',
    RENTALS: 'rentals',
    ENVIRONMENT_TEMPLATES: 'environment_templates',
    USAGE_METRICS: 'usage_metrics',
    PAYMENTS: 'payments'
  },
  
  // Stripe endpoints
  STRIPE: {
    PAYMENT_INTENTS: '/payment_intents',
    PAYMENT_METHODS: '/payment_methods',
    CUSTOMERS: '/customers'
  }
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;

// Maximum number of retries for failed requests
export const MAX_RETRIES = 3;

// Default pagination settings
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10
};

// Cache TTL in milliseconds
export const CACHE_TTL = {
  GPU_LIST: 5 * 60 * 1000, // 5 minutes
  ENVIRONMENT_TEMPLATES: 30 * 60 * 1000, // 30 minutes
  USER_PROFILE: 15 * 60 * 1000 // 15 minutes
};

