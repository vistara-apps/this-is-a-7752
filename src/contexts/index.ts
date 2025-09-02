/**
 * Contexts Index
 * 
 * This file exports all context providers and hooks for easy importing throughout the application.
 */

// Export Auth Context
export { AuthProvider, useAuth } from './AuthContext';

// Export Payment Context
export { PaymentProvider, usePayment } from './PaymentContext';

// Export GPU Context
export { GPUProvider, useGPU } from './GPUContext';

// Export Environment Context
export { EnvironmentProvider, useEnvironment } from './EnvironmentContext';

// Combined App Provider that wraps all contexts
import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { PaymentProvider } from './PaymentContext';
import { GPUProvider } from './GPUContext';
import { EnvironmentProvider } from './EnvironmentContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <PaymentProvider>
        <GPUProvider>
          <EnvironmentProvider>
            {children}
          </EnvironmentProvider>
        </GPUProvider>
      </PaymentProvider>
    </AuthProvider>
  );
};

