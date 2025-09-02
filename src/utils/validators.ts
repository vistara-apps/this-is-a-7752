/**
 * Validation Utility Functions
 * 
 * This file contains utility functions for validating data in the application.
 */

/**
 * Validates an email address
 * 
 * @param email - Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password meets minimum requirements
 * 
 * @param password - Password to validate
 * @param minLength - Minimum length (default: 8)
 * @returns Boolean indicating if the password is valid
 */
export function isValidPassword(password: string, minLength: number = 8): boolean {
  if (password.length < minLength) return false;
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Check for at least one number
  if (!/[0-9]/.test(password)) return false;
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
  
  return true;
}

/**
 * Validates a wallet address format
 * 
 * @param address - Wallet address to validate
 * @param chain - Blockchain type (default: 'ethereum')
 * @returns Boolean indicating if the wallet address is valid
 */
export function isValidWalletAddress(address: string, chain: string = 'ethereum'): boolean {
  if (!address) return false;
  
  switch (chain.toLowerCase()) {
    case 'ethereum':
    case 'base':
      // Ethereum-like address validation (0x followed by 40 hex characters)
      return /^0x[a-fA-F0-9]{40}$/.test(address);
      
    case 'bitcoin':
      // Basic Bitcoin address validation
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || 
             /^bc1[ac-hj-np-z02-9]{39,59}$/.test(address);
      
    case 'solana':
      // Solana address validation
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      
    default:
      // Default to Ethereum-like validation
      return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}

/**
 * Validates a credit card number using Luhn algorithm
 * 
 * @param cardNumber - Credit card number to validate
 * @returns Boolean indicating if the card number is valid
 */
export function isValidCreditCard(cardNumber: string): boolean {
  // Remove spaces and dashes
  const sanitizedNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if contains only digits
  if (!/^\d+$/.test(sanitizedNumber)) return false;
  
  // Check length (most cards are 13-19 digits)
  if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) return false;
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitizedNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

/**
 * Validates a rental duration is within allowed limits
 * 
 * @param hours - Duration in hours
 * @param minHours - Minimum allowed hours (default: 1)
 * @param maxHours - Maximum allowed hours (default: 720, 30 days)
 * @returns Boolean indicating if the duration is valid
 */
export function isValidRentalDuration(
  hours: number,
  minHours: number = 1,
  maxHours: number = 720
): boolean {
  return hours >= minHours && hours <= maxHours;
}

/**
 * Validates a payment amount is within allowed limits
 * 
 * @param amount - Payment amount
 * @param minAmount - Minimum allowed amount (default: 0.01)
 * @param maxAmount - Maximum allowed amount (default: 10000)
 * @returns Boolean indicating if the amount is valid
 */
export function isValidPaymentAmount(
  amount: number,
  minAmount: number = 0.01,
  maxAmount: number = 10000
): boolean {
  return amount >= minAmount && amount <= maxAmount;
}

/**
 * Validates a string is not empty or just whitespace
 * 
 * @param str - String to validate
 * @returns Boolean indicating if the string is not empty
 */
export function isNotEmpty(str: string): boolean {
  return str.trim().length > 0;
}

/**
 * Validates a URL format
 * 
 * @param url - URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Validates a date is in the future
 * 
 * @param dateString - Date string to validate
 * @returns Boolean indicating if the date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  
  return date > now;
}

