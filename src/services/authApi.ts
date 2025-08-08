import axios, { AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  LoginResponse,
  User, 
  ApiResponse 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
authApi.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
authApi.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // Don't automatically redirect - let the AuthContext handle logout
    if (error.response?.status === 401) {
      // Only remove token, don't redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Authentication API endpoints
export const authApiService = {
  login: (data: LoginRequest): Promise<AxiosResponse<LoginResponse>> => 
    authApi.post('/login', data),

  logout: (): Promise<AxiosResponse<void>> => 
    authApi.post('/logout'),
  
  getCurrentUser: (): Promise<AxiosResponse<ApiResponse<User>>> => 
    authApi.get('/profile'),
};

// Export for backward compatibility
export { authApiService as authApi };
export default authApiService;
