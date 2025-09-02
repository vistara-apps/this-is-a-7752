/**
 * Storage Utility Functions
 * 
 * This file contains utility functions for working with browser storage.
 */

/**
 * Sets an item in localStorage with optional expiration
 * 
 * @param key - Storage key
 * @param value - Value to store
 * @param expirationMinutes - Optional expiration time in minutes
 */
export function setStorageItem(
  key: string,
  value: any,
  expirationMinutes?: number
): void {
  try {
    const item = {
      value,
      expiration: expirationMinutes
        ? new Date().getTime() + expirationMinutes * 60 * 1000
        : null
    };
    
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting localStorage item:', error);
  }
}

/**
 * Gets an item from localStorage, checking for expiration
 * 
 * @param key - Storage key
 * @returns The stored value, or null if expired or not found
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    
    // Check for expiration
    if (item.expiration && new Date().getTime() > item.expiration) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value as T;
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
}

/**
 * Removes an item from localStorage
 * 
 * @param key - Storage key
 */
export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage item:', error);
  }
}

/**
 * Clears all items from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Sets an item in sessionStorage
 * 
 * @param key - Storage key
 * @param value - Value to store
 */
export function setSessionItem(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting sessionStorage item:', error);
  }
}

/**
 * Gets an item from sessionStorage
 * 
 * @param key - Storage key
 * @returns The stored value, or null if not found
 */
export function getSessionItem<T>(key: string): T | null {
  try {
    const itemStr = sessionStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    return JSON.parse(itemStr) as T;
  } catch (error) {
    console.error('Error getting sessionStorage item:', error);
    return null;
  }
}

/**
 * Removes an item from sessionStorage
 * 
 * @param key - Storage key
 */
export function removeSessionItem(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing sessionStorage item:', error);
  }
}

/**
 * Clears all items from sessionStorage
 */
export function clearSessionStorage(): void {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
  }
}

/**
 * Gets the total size of localStorage in bytes
 * 
 * @returns Size in bytes
 */
export function getLocalStorageSize(): number {
  try {
    let totalSize = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key) {
        const value = localStorage.getItem(key);
        totalSize += (key.length + (value ? value.length : 0)) * 2; // UTF-16 uses 2 bytes per character
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
}

