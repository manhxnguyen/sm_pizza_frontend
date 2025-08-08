/**
 * Token utility functions for JWT token management
 */

export interface TokenInfo {
  token: string;
  expiresAt: string;
  isValid: boolean;
  isExpired: boolean;
  expiresInMinutes: number;
}

/**
 * Parse JWT token to extract expiration time
 */
export const parseJwtToken = (token: string): { exp?: number; [key: string]: any } | null => {
  try {
    // JWT has 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwtToken(token);
  if (!decoded || !decoded.exp) {
    return true; // If we can't decode or no exp, consider expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Check if token will expire soon (within specified minutes)
 */
export const isTokenExpiringSoon = (token: string, thresholdMinutes: number = 5): boolean => {
  const decoded = parseJwtToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const thresholdTime = currentTime + (thresholdMinutes * 60);
  return decoded.exp < thresholdTime;
};

/**
 * Get token expiration info
 */
export const getTokenInfo = (token: string | null): TokenInfo | null => {
  if (!token) {
    return null;
  }

  const decoded = parseJwtToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const expiresAt = new Date(decoded.exp * 1000).toISOString();
  const isExpired = decoded.exp < currentTime;
  const expiresInMinutes = Math.floor((decoded.exp - currentTime) / 60);

  return {
    token,
    expiresAt,
    isValid: !isExpired,
    isExpired,
    expiresInMinutes: Math.max(0, expiresInMinutes)
  };
};

/**
 * Check if stored token is valid and not expired
 */
export const isStoredTokenValid = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return false;
  }

  return !isTokenExpired(token);
};

/**
 * Get minutes until token expires
 */
export const getMinutesUntilExpiration = (token: string): number => {
  const tokenInfo = getTokenInfo(token);
  return tokenInfo ? tokenInfo.expiresInMinutes : 0;
};

/**
 * Clean up expired tokens from localStorage
 */
export const cleanupExpiredTokens = (): void => {
  const token = localStorage.getItem('authToken');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('user');
  }
};
