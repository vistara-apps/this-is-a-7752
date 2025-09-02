/**
 * Payment Context
 * 
 * This context provides payment-related state and functions throughout the application.
 * It handles payment methods, transactions, and payment processing.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PaymentInfo, PaymentTransaction, ApiResponse } from '../types';
import { API } from '../api';
import { useAuth } from './AuthContext';

// Context interface
interface PaymentContextType {
  paymentMethods: PaymentInfo[];
  defaultPaymentMethod: PaymentInfo | null;
  recentTransactions: PaymentTransaction[];
  isLoading: boolean;
  error: string | null;
  addPaymentMethod: (paymentMethodData: Partial<PaymentInfo>) => Promise<boolean>;
  removePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  initiateBlockchainPayment: (rentalId: string, walletAddress: string, amount: number) => Promise<ApiResponse<PaymentTransaction>>;
  createStripePaymentIntent: (rentalId: string, amount: number, currency?: string) => Promise<ApiResponse<{ clientSecret: string, paymentIntentId: string }>>;
  confirmStripePayment: (paymentIntentId: string) => Promise<ApiResponse<PaymentTransaction>>;
  refreshPaymentMethods: () => Promise<void>;
  refreshTransactionHistory: () => Promise<void>;
}

// Create the context with default values
const PaymentContext = createContext<PaymentContextType>({
  paymentMethods: [],
  defaultPaymentMethod: null,
  recentTransactions: [],
  isLoading: false,
  error: null,
  addPaymentMethod: async () => false,
  removePaymentMethod: async () => false,
  setDefaultPaymentMethod: async () => false,
  initiateBlockchainPayment: async () => ({ success: false }),
  createStripePaymentIntent: async () => ({ success: false }),
  confirmStripePayment: async () => ({ success: false }),
  refreshPaymentMethods: async () => {},
  refreshTransactionHistory: async () => {}
});

// Props for the PaymentProvider component
interface PaymentProviderProps {
  children: ReactNode;
}

// PaymentProvider component
export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentInfo[]>([]);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<PaymentInfo | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load payment methods when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshPaymentMethods();
      refreshTransactionHistory();
    } else {
      // Clear payment data when not authenticated
      setPaymentMethods([]);
      setDefaultPaymentMethod(null);
      setRecentTransactions([]);
    }
  }, [isAuthenticated]);

  // Refresh payment methods
  const refreshPaymentMethods = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Payment.getUserPaymentMethods();
      
      if (response.success && response.data) {
        setPaymentMethods(response.data);
        
        // Find default payment method
        const defaultMethod = response.data.find(method => method.default) || null;
        setDefaultPaymentMethod(defaultMethod);
      } else {
        setError(response.error || 'Failed to load payment methods');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load payment methods');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh transaction history
  const refreshTransactionHistory = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    
    try {
      const response = await API.Payment.getPaymentHistory();
      
      if (response.success && response.data) {
        setRecentTransactions(response.data);
      }
    } catch (err) {
      console.error('Failed to load transaction history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new payment method
  const addPaymentMethod = async (paymentMethodData: Partial<PaymentInfo>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Payment.addPaymentMethod(paymentMethodData);
      
      if (response.success && response.data) {
        await refreshPaymentMethods();
        return true;
      } else {
        setError(response.error || 'Failed to add payment method');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add payment method');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a payment method
  const removePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Payment.removePaymentMethod(paymentMethodId);
      
      if (response.success) {
        await refreshPaymentMethods();
        return true;
      } else {
        setError(response.error || 'Failed to remove payment method');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to remove payment method');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Set a payment method as default
  const setAsDefaultPaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Payment.setDefaultPaymentMethod(paymentMethodId);
      
      if (response.success && response.data) {
        await refreshPaymentMethods();
        return true;
      } else {
        setError(response.error || 'Failed to set default payment method');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to set default payment method');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate blockchain payment
  const initiateBlockchainPayment = async (
    rentalId: string,
    walletAddress: string,
    amount: number
  ): Promise<ApiResponse<PaymentTransaction>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Payment.initiateBlockchainPayment(rentalId, walletAddress, amount);
      
      if (response.success) {
        await refreshTransactionHistory();
      } else {
        setError(response.error || 'Payment failed');
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Create Stripe payment intent
  const createStripePaymentIntent = async (
    rentalId: string,
    amount: number,
    currency: string = 'usd'
  ): Promise<ApiResponse<{ clientSecret: string, paymentIntentId: string }>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Payment.createStripePaymentIntent(rentalId, amount, currency);
      
      if (!response.success) {
        setError(response.error || 'Failed to create payment intent');
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create payment intent');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm Stripe payment
  const confirmStripePayment = async (
    paymentIntentId: string
  ): Promise<ApiResponse<PaymentTransaction>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Payment.confirmStripePayment(paymentIntentId);
      
      if (response.success) {
        await refreshTransactionHistory();
      } else {
        setError(response.error || 'Payment confirmation failed');
      }
      
      return response;
    } catch (err: any) {
      setError(err.message || 'Payment confirmation failed');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    paymentMethods,
    defaultPaymentMethod,
    recentTransactions,
    isLoading,
    error,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod: setAsDefaultPaymentMethod,
    initiateBlockchainPayment,
    createStripePaymentIntent,
    confirmStripePayment,
    refreshPaymentMethods,
    refreshTransactionHistory
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Custom hook for using the payment context
export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  
  return context;
};

