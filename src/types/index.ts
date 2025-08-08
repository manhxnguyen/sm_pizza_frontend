export interface Topping {
  id: number;
  name: string;
  price?: string;
  formatted_price?: string;
  created_at: string;
  updated_at: string;
}

export interface Pizza {
  id: number;
  name: string;
  description?: string;
  total_price?: string;
  topping_names?: string;
  toppings: Topping[];
  created_at: string;
  updated_at: string;
}

export interface CreateToppingRequest {
  name: string;
  price: string;
}

export interface UpdateToppingRequest {
  name: string;
  price: string;
}

export interface CreatePizzaRequest {
  name: string;
  topping_ids: number[];
}

export interface UpdatePizzaRequest {
  name?: string;
  topping_ids?: number[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Dashboard Types
export interface DashboardStatistics {
  total_toppings: number;
  total_pizzas: number;
  total_users: number;
}

export interface DashboardData {
  statistics: DashboardStatistics;
}

export interface DashboardResponse {
  dashboard: DashboardData;
}

// Authentication & Authorization Types
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  PIZZA_STORE_OWNER = 'pizza_store_owner',
  PIZZA_CHEF = 'pizza_chef'
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  name?: string; // For backward compatibility
  role: UserRole;
  permissions: {
    can_manage_toppings: boolean;
    can_manage_pizzas: boolean;
    can_manage_users: boolean;
  };
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
  expires_at?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Permission Types
export interface Permissions {
  // Topping permissions
  canViewToppings: boolean;
  canCreateToppings: boolean;
  canUpdateToppings: boolean;
  canDeleteToppings: boolean;
  
  // Pizza permissions  
  canViewPizzas: boolean;
  canCreatePizzas: boolean;
  canUpdatePizzas: boolean;
  canDeletePizzas: boolean;
  
  // General permissions
  canManageUsers: boolean;
  canViewDashboard: boolean;
  
  // Legacy permissions (for backward compatibility)
  canManageToppings: boolean;
  canManagePizzas: boolean;
}

// JSON:API Types for Backend Response
export interface JsonApiResource {
  id: string;
  type: string;
  attributes: Record<string, any>;
  relationships?: Record<string, JsonApiRelationship>;
}

export interface JsonApiRelationship {
  data: JsonApiResourceIdentifier | JsonApiResourceIdentifier[];
}

export interface JsonApiResourceIdentifier {
  id: string;
  type: string;
}

export interface JsonApiResponse<T = JsonApiResource> {
  data: T | T[];
  included?: JsonApiResource[];
  meta?: Record<string, any>;
}
