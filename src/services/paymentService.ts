/**
 * Payment Service
 * 
 * This service provides business logic for payment-related operations,
 * including payment processing, fee calculation, and transaction management.
 */

import { API } from '../api';
import { 
  PaymentTransaction, 
  PaymentInfo,
  Rental,
  GPUProvider,
  ApiResponse
} from '../types';

/**
 * Calculates the total cost for a rental including fees
 * 
 * @param gpu - GPU provider details
 * @param hours - Rental duration in hours
 * @param paymentMethod - Payment method type ('wallet' or 'card')
 * @returns Object with cost breakdown
 */
export function calculateTotalCost(
  gpu: GPUProvider,
  hours: number,
  paymentMethod: 'wallet' | 'card' = 'wallet'
): {
  baseCost: number;
  processingFee: number;
  networkFee: number;
  discount: number;
  totalCost: number;
} {
  // Calculate base cost
  const baseCost = gpu.pricePerHour * hours;
  
  // Calculate volume discount
  let discount = 0;
  if (hours >= 720) { // 30 days
    discount = baseCost * 0.2; // 20% discount
  } else if (hours >= 168) { // 7 days
    discount = baseCost * 0.1; // 10% discount
  } else if (hours >= 24) { // 1 day
    discount = baseCost * 0.05; // 5% discount
  }
  
  // Calculate processing fee based on payment method
  const processingFee = paymentMethod === 'card' 
    ? baseCost * 0.029 + 0.30 // 2.9% + $0.30 for card payments
    : baseCost * 0.01; // 1% for wallet payments
  
  // Calculate network fee for blockchain transactions
  const networkFee = paymentMethod === 'wallet' ? 0.15 : 0; // $0.15 for wallet payments
  
  // Calculate total cost
  const totalCost = baseCost - discount + processingFee + networkFee;
  
  return {
    baseCost: parseFloat(baseCost.toFixed(2)),
    processingFee: parseFloat(processingFee.toFixed(2)),
    networkFee: parseFloat(networkFee.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2))
  };
}

/**
 * Processes a payment for a rental
 * 
 * @param rental - Rental details
 * @param paymentMethod - Payment method to use
 * @returns Promise with payment transaction
 */
export async function processPayment(
  rental: Rental,
  paymentMethod: PaymentInfo
): Promise<ApiResponse<PaymentTransaction>> {
  try {
    if (paymentMethod.type === 'wallet') {
      // Process blockchain payment
      return API.Payment.initiateBlockchainPayment(
        rental.rentalId,
        paymentMethod.details,
        rental.cost
      );
    } else {
      // Process card payment via Stripe
      const stripeResponse = await API.Payment.createStripePaymentIntent(
        rental.rentalId,
        Math.round(rental.cost * 100) // Convert to cents for Stripe
      );
      
      if (!stripeResponse.success || !stripeResponse.data) {
        return stripeResponse;
      }
      
      // Confirm the payment (in a real app, this would happen after client-side confirmation)
      return API.Payment.confirmStripePayment(stripeResponse.data.paymentIntentId);
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Payment processing failed'
    };
  }
}

/**
 * Generates a payment receipt for a transaction
 * 
 * @param transaction - Payment transaction details
 * @returns Receipt data
 */
export function generateReceipt(
  transaction: PaymentTransaction
): {
  receiptId: string;
  timestamp: string;
  items: Array<{ description: string; amount: number }>;
  subtotal: number;
  fees: number;
  total: number;
} {
  // Generate a unique receipt ID
  const receiptId = `RCPT-${transaction.transactionId.substring(0, 8)}-${Date.now().toString(36)}`;
  
  // Create receipt data
  return {
    receiptId,
    timestamp: transaction.timestamp,
    items: [
      { description: 'GPU Rental', amount: transaction.amount * 0.95 } // Assuming 95% of amount is the base cost
    ],
    subtotal: transaction.amount * 0.95,
    fees: transaction.amount * 0.05, // Assuming 5% of amount is fees
    total: transaction.amount
  };
}

/**
 * Checks if a payment method is valid and not expired
 * 
 * @param paymentMethod - Payment method to validate
 * @returns Boolean indicating if the payment method is valid
 */
export function isPaymentMethodValid(paymentMethod: PaymentInfo): boolean {
  if (paymentMethod.type === 'wallet') {
    // Check if wallet address is valid (basic check)
    return paymentMethod.details.startsWith('0x') && paymentMethod.details.length === 42;
  } else {
    // For card payments, we would check expiration date
    // This is a simplified example
    const cardDetails = paymentMethod.details.split('|');
    if (cardDetails.length < 2) return false;
    
    const expirationDate = cardDetails[1];
    if (!expirationDate) return false;
    
    // Parse expiration date (MM/YY format)
    const [month, year] = expirationDate.split('/');
    if (!month || !year) return false;
    
    const expirationMonth = parseInt(month, 10);
    const expirationYear = 2000 + parseInt(year, 10);
    
    // Create date objects for comparison
    const expirationTime = new Date(expirationYear, expirationMonth - 1).getTime();
    const currentTime = new Date().getTime();
    
    return expirationTime > currentTime;
  }
}

/**
 * Estimates transaction fees for a payment
 * 
 * @param amount - Payment amount
 * @param paymentMethod - Payment method type ('wallet' or 'card')
 * @returns Estimated transaction fees
 */
export function estimateTransactionFees(
  amount: number,
  paymentMethod: 'wallet' | 'card'
): {
  processingFee: number;
  networkFee: number;
  totalFees: number;
} {
  // Calculate processing fee based on payment method
  const processingFee = paymentMethod === 'card' 
    ? amount * 0.029 + 0.30 // 2.9% + $0.30 for card payments
    : amount * 0.01; // 1% for wallet payments
  
  // Calculate network fee for blockchain transactions
  const networkFee = paymentMethod === 'wallet' ? 0.15 : 0; // $0.15 for wallet payments
  
  // Calculate total fees
  const totalFees = processingFee + networkFee;
  
  return {
    processingFee: parseFloat(processingFee.toFixed(2)),
    networkFee: parseFloat(networkFee.toFixed(2)),
    totalFees: parseFloat(totalFees.toFixed(2))
  };
}

