/**
 * Payment API Service
 * 
 * This file contains functions for payment processing, including
 * both blockchain-based payments via Turnkey and fiat payments via Stripe.
 */

import { apiRequest } from './client';
import { ENDPOINTS } from './config';
import { 
  PaymentTransaction,
  PaymentInfo,
  ApiResponse
} from '../types';

/**
 * Initiates a blockchain payment for a rental
 * 
 * @param rentalId - ID of the rental to pay for
 * @param walletAddress - User's wallet address
 * @param amount - Payment amount
 * @returns Promise with payment transaction details
 */
export async function initiateBlockchainPayment(
  rentalId: string,
  walletAddress: string,
  amount: number
): Promise<ApiResponse<PaymentTransaction>> {
  return apiRequest<PaymentTransaction>(
    'TURNKEY',
    'POST',
    ENDPOINTS.TURNKEY.INITIATE_PAYMENT,
    {
      rentalId,
      walletAddress,
      amount
    }
  );
}

/**
 * Checks the status of a blockchain payment
 * 
 * @param transactionId - ID of the payment transaction
 * @returns Promise with payment status
 */
export async function checkBlockchainPaymentStatus(
  transactionId: string
): Promise<ApiResponse<PaymentTransaction>> {
  return apiRequest<PaymentTransaction>(
    'TURNKEY',
    'GET',
    `${ENDPOINTS.TURNKEY.PAYMENT_STATUS}/${transactionId}`
  );
}

/**
 * Creates a Stripe payment intent for fiat payment
 * 
 * @param rentalId - ID of the rental to pay for
 * @param amount - Payment amount in cents
 * @param currency - Payment currency (default: 'usd')
 * @returns Promise with Stripe payment intent
 */
export async function createStripePaymentIntent(
  rentalId: string,
  amount: number,
  currency: string = 'usd'
): Promise<ApiResponse<{ clientSecret: string, paymentIntentId: string }>> {
  return apiRequest<{ clientSecret: string, paymentIntentId: string }>(
    'STRIPE',
    'POST',
    ENDPOINTS.STRIPE.PAYMENT_INTENTS,
    {
      rentalId,
      amount,
      currency
    }
  );
}

/**
 * Confirms a Stripe payment
 * 
 * @param paymentIntentId - ID of the Stripe payment intent
 * @returns Promise with payment confirmation
 */
export async function confirmStripePayment(
  paymentIntentId: string
): Promise<ApiResponse<PaymentTransaction>> {
  return apiRequest<PaymentTransaction>(
    'STRIPE',
    'POST',
    `${ENDPOINTS.STRIPE.PAYMENT_INTENTS}/${paymentIntentId}/confirm`
  );
}

/**
 * Adds a new payment method for the user
 * 
 * @param paymentMethodData - Payment method data (card details or wallet)
 * @returns Promise with saved payment method
 */
export async function addPaymentMethod(
  paymentMethodData: Partial<PaymentInfo>
): Promise<ApiResponse<PaymentInfo>> {
  return apiRequest<PaymentInfo>(
    'SUPABASE',
    'POST',
    `${ENDPOINTS.SUPABASE.USERS}/payment-methods`,
    paymentMethodData
  );
}

/**
 * Gets all payment methods for the current user
 * 
 * @returns Promise with list of payment methods
 */
export async function getUserPaymentMethods(): Promise<ApiResponse<PaymentInfo[]>> {
  return apiRequest<PaymentInfo[]>(
    'SUPABASE',
    'GET',
    `${ENDPOINTS.SUPABASE.USERS}/payment-methods`
  );
}

/**
 * Sets a payment method as default
 * 
 * @param paymentMethodId - ID of the payment method to set as default
 * @returns Promise with updated payment method
 */
export async function setDefaultPaymentMethod(
  paymentMethodId: string
): Promise<ApiResponse<PaymentInfo>> {
  return apiRequest<PaymentInfo>(
    'SUPABASE',
    'PATCH',
    `${ENDPOINTS.SUPABASE.USERS}/payment-methods/${paymentMethodId}/default`
  );
}

/**
 * Removes a payment method
 * 
 * @param paymentMethodId - ID of the payment method to remove
 * @returns Promise with removal result
 */
export async function removePaymentMethod(
  paymentMethodId: string
): Promise<ApiResponse<{ success: boolean }>> {
  return apiRequest<{ success: boolean }>(
    'SUPABASE',
    'DELETE',
    `${ENDPOINTS.SUPABASE.USERS}/payment-methods/${paymentMethodId}`
  );
}

/**
 * Gets payment transaction history for the current user
 * 
 * @param limit - Maximum number of transactions to return
 * @returns Promise with list of payment transactions
 */
export async function getPaymentHistory(
  limit: number = 10
): Promise<ApiResponse<PaymentTransaction[]>> {
  return apiRequest<PaymentTransaction[]>(
    'SUPABASE',
    'GET',
    `${ENDPOINTS.SUPABASE.PAYMENTS}/history`,
    undefined,
    { limit }
  );
}

