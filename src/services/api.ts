import axios, { AxiosResponse } from 'axios';
import { 
  Topping, 
  Pizza, 
  CreateToppingRequest, 
  UpdateToppingRequest, 
  CreatePizzaRequest, 
  UpdatePizzaRequest,
  ApiResponse,
  DashboardResponse
} from '../types';
import { 
  transformPizzasFromJsonApi, 
  transformToppingsFromJsonApi, 
  transformSinglePizzaFromJsonApi, 
  transformSingleToppingFromJsonApi 
} from '../utils/jsonApiTransform';
import { handleTokenExpiration } from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling and authentication
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors - auto logout on token expiration
    if (error.response?.status === 401) {
      console.log('🔒 Received 401 Unauthorized - Token expired');
      handleTokenExpiration();
    }
    
    return Promise.reject(error);
  }
);

// Toppings API
export const toppingsApi = {
  getAll: async (): Promise<AxiosResponse<ApiResponse<Topping[]>>> => {
    const response = await api.get('/toppings');
    const transformedData = transformToppingsFromJsonApi(response.data);
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  getById: async (id: number): Promise<AxiosResponse<ApiResponse<Topping>>> => {
    const response = await api.get(`/toppings/${id}`);
    const transformedData = transformSingleToppingFromJsonApi(response.data);
    if (!transformedData) {
      throw new Error('Failed to transform topping data');
    }
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  create: async (data: CreateToppingRequest): Promise<AxiosResponse<ApiResponse<Topping>>> => {
    const response = await api.post('/toppings', { topping: data });
    const transformedData = transformSingleToppingFromJsonApi(response.data);
    if (!transformedData) {
      throw new Error('Failed to transform created topping data');
    }
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  update: async (id: number, data: UpdateToppingRequest): Promise<AxiosResponse<ApiResponse<Topping>>> => {
    const response = await api.put(`/toppings/${id}`, { topping: data });
    const transformedData = transformSingleToppingFromJsonApi(response.data);
    if (!transformedData) {
      throw new Error('Failed to transform updated topping data');
    }
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  delete: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/toppings/${id}`),
};

// Pizzas API
export const pizzasApi = {
  getAll: async (): Promise<AxiosResponse<ApiResponse<Pizza[]>>> => {
    const response = await api.get('/pizzas');
    const transformedData = transformPizzasFromJsonApi(response.data);
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  getById: async (id: number): Promise<AxiosResponse<ApiResponse<Pizza>>> => {
    const response = await api.get(`/pizzas/${id}`);
    const transformedData = transformSinglePizzaFromJsonApi(response.data);
    if (!transformedData) {
      throw new Error('Failed to transform pizza data');
    }
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  create: async (data: CreatePizzaRequest): Promise<AxiosResponse<ApiResponse<Pizza>>> => {
    const response = await api.post('/pizzas', { pizza: data });
    const transformedData = transformSinglePizzaFromJsonApi(response.data);
    if (!transformedData) {
      throw new Error('Failed to transform created pizza data');
    }
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  update: async (id: number, data: UpdatePizzaRequest): Promise<AxiosResponse<ApiResponse<Pizza>>> => {
    const response = await api.put(`/pizzas/${id}`, { pizza: data });
    const transformedData = transformSinglePizzaFromJsonApi(response.data);
    if (!transformedData) {
      throw new Error('Failed to transform updated pizza data');
    }
    return {
      ...response,
      data: {
        data: transformedData,
        message: response.data.message
      }
    };
  },
  
  delete: (id: number): Promise<AxiosResponse<void>> => 
    api.delete(`/pizzas/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getData: async (): Promise<AxiosResponse<DashboardResponse>> => {
    const response = await api.get('/dashboard');
    return response;
  },
};

export default api;
