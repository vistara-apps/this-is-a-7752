/**
 * Authentication API Service
 * 
 * This file contains functions for user authentication, wallet management,
 * and identity verification using Privy and Turnkey.
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';
import { 
  User,
  AuthCredentials,
  AuthResponse,
  ApiResponse,
  PaymentInfo
} from '../types';

/**
 * Authenticates a user with email and password
 * 
 * @param credentials - User email and password
 * @returns Promise with authentication response
 */
export async function loginWithEmail(
  credentials: AuthCredentials
): Promise<ApiResponse<AuthResponse>> {
  return apiRequest<AuthResponse>(
    'PRIVY',
    'POST',
    ENDPOINTS.PRIVY.LOGIN,
    credentials
  );
}

/**
 * Authenticates a user with wallet signature
 * 
 * @param walletAddress - User's wallet address
 * @param signature - Signed message proving wallet ownership
 * @returns Promise with authentication response
 */
export async function loginWithWallet(
  walletAddress: string,
  signature: string
): Promise<ApiResponse<AuthResponse>> {
  return apiRequest<AuthResponse>(
    'PRIVY',
    'POST',
    ENDPOINTS.PRIVY.LOGIN,
    {
      walletAddress,
      signature
    }
  );
}

/**
 * Registers a new user with email and password
 * 
 * @param email - User's email
 * @param password - User's password
 * @returns Promise with registration response
 */
export async function registerWithEmail(
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> {
  return apiRequest<AuthResponse>(
    'PRIVY',
    'POST',
    `${ENDPOINTS.PRIVY.LOGIN}/register`,
    {
      email,
      password
    }
  );
}

/**
 * Links a wallet to an existing user account
 * 
 * @param walletAddress - Wallet address to link
 * @param signature - Signed message proving wallet ownership
 * @returns Promise with linking response
 */
export async function linkWallet(
  walletAddress: string,
  signature: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    'PRIVY',
    'POST',
    ENDPOINTS.PRIVY.LINK_WALLET,
    {
      walletAddress,
      signature
    }
  );
}

/**
 * Creates a new wallet for the user using Turnkey
 * 
 * @returns Promise with created wallet details
 */
export async function createWallet(): Promise<ApiResponse<PaymentInfo>> {
  return apiRequest<PaymentInfo>(
    'TURNKEY',
    'POST',
    ENDPOINTS.TURNKEY.CREATE_WALLET
  );
}

/**
 * Gets the current user's profile
 * 
 * @returns Promise with user profile data
 */
export async function getUserProfile(): Promise<ApiResponse<User>> {
  return apiRequest<User>(
    'PRIVY',
    'GET',
    ENDPOINTS.PRIVY.USER_PROFILE
  );
}

/**
 * Updates the current user's profile
 * 
 * @param userData - Updated user data
 * @returns Promise with updated user profile
 */
export async function updateUserProfile(
  userData: Partial<User>
): Promise<ApiResponse<User>> {
  return apiRequest<User>(
    'PRIVY',
    'PATCH',
    ENDPOINTS.PRIVY.USER_PROFILE,
    userData
  );
}

/**
 * Logs out the current user
 * 
 * @returns Promise with logout result
 */
export async function logout(): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    'PRIVY',
    'POST',
    `${ENDPOINTS.PRIVY.LOGIN}/logout`
  );
}

/**
 * Requests a password reset for a user
 * 
 * @param email - User's email address
 * @returns Promise with reset request result
 */
export async function requestPasswordReset(
  email: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    'PRIVY',
    'POST',
    `${ENDPOINTS.PRIVY.LOGIN}/reset-password`,
    { email }
  );
}

/**
 * Verifies a user's email address
 * 
 * @param token - Email verification token
 * @returns Promise with verification result
 */
export async function verifyEmail(
  token: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    'PRIVY',
    'POST',
    `${ENDPOINTS.PRIVY.LOGIN}/verify-email`,
    { token }
  );
}

