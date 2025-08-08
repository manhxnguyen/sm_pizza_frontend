// Global auth utilities for handling token expiration across the app

let logoutCallback: (() => void) | null = null;

// Register the logout callback from AuthContext
export const setLogoutCallback = (callback: () => void): void => {
  logoutCallback = callback;
};

// Clear the logout callback
export const clearLogoutCallback = (): void => {
  logoutCallback = null;
};

// Handle token expiration - can be called from anywhere in the app
export const handleTokenExpiration = (): void => {
  console.log('🔒 Token expired, logging out user...');
  
  // Clear local storage immediately
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  
  // Call the logout callback if available
  if (logoutCallback) {
    logoutCallback();
  } else {
    // Fallback: redirect to login page directly
    console.warn('No logout callback available, redirecting manually');
    window.location.href = '/login';
  }
};

// Check if token is expired based on timestamp (if available)
export const isTokenExpired = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return true;
  }
  
  // If you store expiration time, you can check it here
  const expirationTime = localStorage.getItem('tokenExpiration');
  if (expirationTime) {
    const now = Date.now();
    return now > parseInt(expirationTime, 10);
  }
  
  // If no expiration info, assume token is valid
  // The server will validate and return 401 if expired
  return false;
};

// Save token with expiration info (call this during login)
export const saveAuthToken = (token: string, expiresAt?: string): void => {
  localStorage.setItem('authToken', token);
  
  if (expiresAt) {
    const expirationTimestamp = new Date(expiresAt).getTime();
    localStorage.setItem('tokenExpiration', expirationTimestamp.toString());
  }
};
