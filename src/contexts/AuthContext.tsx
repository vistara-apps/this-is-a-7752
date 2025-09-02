/**
 * Authentication Context
 * 
 * This context provides authentication state and functions throughout the application.
 * It handles user login, registration, profile management, and session persistence.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthCredentials, ApiResponse, AuthResponse } from '../types';
import { API } from '../api';

// Context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithEmail: (credentials: AuthCredentials) => Promise<boolean>;
  loginWithWallet: (walletAddress: string, signature: string) => Promise<boolean>;
  registerWithEmail: (email: string, password: string) => Promise<boolean>;
  linkWallet: (walletAddress: string, signature: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  loginWithEmail: async () => false,
  loginWithWallet: async () => false,
  registerWithEmail: async () => false,
  linkWallet: async () => false,
  logout: async () => {},
  updateProfile: async () => false
});

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken');
        
        if (token) {
          // Fetch user profile with the token
          const response = await API.Auth.getUserProfile();
          
          if (response.success && response.data) {
            setUser(response.data);
            setIsAuthenticated(true);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Handle successful authentication
  const handleAuthSuccess = (response: ApiResponse<AuthResponse>): boolean => {
    if (response.success && response.data) {
      const { user, token, expiresAt } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      
      return true;
    } else {
      setError(response.error || 'Authentication failed');
      return false;
    }
  };

  // Login with email and password
  const loginWithEmail = async (credentials: AuthCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Auth.loginWithEmail(credentials);
      return handleAuthSuccess(response);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with wallet
  const loginWithWallet = async (walletAddress: string, signature: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Auth.loginWithWallet(walletAddress, signature);
      return handleAuthSuccess(response);
    } catch (err: any) {
      setError(err.message || 'Wallet login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register with email
  const registerWithEmail = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Auth.registerWithEmail(email, password);
      return handleAuthSuccess(response);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Link wallet to account
  const linkWallet = async (walletAddress: string, signature: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Auth.linkWallet(walletAddress, signature);
      
      if (response.success) {
        // Refresh user profile to get updated wallet info
        const profileResponse = await API.Auth.getUserProfile();
        
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data);
        }
        
        return true;
      } else {
        setError(response.error || 'Failed to link wallet');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to link wallet');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      await API.Auth.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state regardless of API response
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await API.Auth.updateUserProfile(userData);
      
      if (response.success && response.data) {
        setUser(response.data);
        return true;
      } else {
        setError(response.error || 'Failed to update profile');
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithEmail,
    loginWithWallet,
    registerWithEmail,
    linkWallet,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

