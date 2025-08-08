/**
 * Validation utilities for form inputs
 */

/**
 * Validates price input for PostgreSQL numeric(8,2) data type
 * - Maximum 8 digits total
 * - Maximum 2 decimal places
 * - Maximum value: 999999.99
 * - Minimum value: 0.00
 */
export const validatePrice = (value: string): string | null => {
  // Check if empty
  if (!value || value.trim() === '') {
    return 'Price is required';
  }

  // Remove any spaces
  const trimmedValue = value.trim();

  // Check if it's a valid number format
  const numberRegex = /^\d+(\.\d{0,2})?$/;
  if (!numberRegex.test(trimmedValue)) {
    return 'Price must be a valid number with up to 2 decimal places (e.g., 12.99)';
  }

  // Convert to number for validation
  const numericValue = parseFloat(trimmedValue);

  // Check minimum value
  if (numericValue < 0) {
    return 'Price must be greater than or equal to 0';
  }

  // Check maximum value for numeric(8,2): 999999.99
  if (numericValue > 999999.99) {
    return 'Price cannot exceed $999,999.99';
  }

  // Check total digits (including decimal places)
  // For numeric(8,2), we can have max 6 digits before decimal + 2 after
  const parts = trimmedValue.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  if (integerPart.length > 6) {
    return 'Price can have a maximum of 6 digits before the decimal point';
  }

  if (decimalPart.length > 2) {
    return 'Price can have a maximum of 2 decimal places';
  }

  return null;
};

/**
 * Formats a price string to ensure proper decimal places
 */
export const formatPriceInput = (value: string): string => {
  if (!value) return '';
  
  // Remove any non-digit and non-decimal characters
  const cleaned = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts.length === 2 && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2);
  }
  
  return cleaned;
};

/**
 * Validates topping name
 */
export const validateToppingName = (value: string): string | null => {
  if (!value.trim()) {
    return 'Topping name is required';
  }
  if (value.trim().length < 2) {
    return 'Topping name must be at least 2 characters';
  }
  if (value.trim().length > 100) {
    return 'Topping name cannot exceed 100 characters';
  }
  return null;
};
