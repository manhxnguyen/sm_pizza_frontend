import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState, Permissions } from '../types';
import authApiService from '../services/authApi';
import { setLogoutCallback, clearLogoutCallback, saveAuthToken, isTokenExpired } from '../utils/auth';

const authApi = authApiService;

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

// Permission utility functions
export const getPermissions = (user: User | null): Permissions => {
  if (!user || !user.permissions) {
    return {
      // Topping permissions
      canViewToppings: false,
      canCreateToppings: false,
      canUpdateToppings: false,
      canDeleteToppings: false,
      
      // Pizza permissions
      canViewPizzas: false,
      canCreatePizzas: false,
      canUpdatePizzas: false,
      canDeletePizzas: false,
      
      // General permissions
      canManageUsers: false,
      canViewDashboard: false,
      
      // Legacy permissions
      canManageToppings: false,
      canManagePizzas: false,
    };
  }

  const { permissions } = user;
  
  return {
    // Topping permissions - derived from can_manage_toppings
    canViewToppings: true, // Everyone can view toppings (Pizza Chef needs to see available toppings)
    canCreateToppings: permissions.can_manage_toppings,
    canUpdateToppings: permissions.can_manage_toppings,
    canDeleteToppings: permissions.can_manage_toppings,
    
    // Pizza permissions - derived from can_manage_pizzas
    canViewPizzas: true, // Everyone can view pizzas (both Store Owners and Pizza Chefs need this)
    canCreatePizzas: permissions.can_manage_pizzas,
    canUpdatePizzas: permissions.can_manage_pizzas,
    canDeletePizzas: permissions.can_manage_pizzas,
    
    // General permissions
    canManageUsers: permissions.can_manage_users,
    canViewDashboard: permissions.can_manage_toppings || permissions.can_manage_pizzas || permissions.can_manage_users,
    
    // Legacy permissions (direct mapping)
    canManageToppings: permissions.can_manage_toppings,
    canManagePizzas: permissions.can_manage_pizzas,
  };
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'Super Admin';
    case UserRole.PIZZA_STORE_OWNER:
      return 'Pizza Store Owner';
    case UserRole.PIZZA_CHEF:
      return 'Pizza Chef';
    default:
      return 'Unknown';
  }
};

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  permissions: Permissions;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const permissions = getPermissions(state.user);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.login({ email, password });
      const { user, token } = response.data;
      
      // Store token and user in localStorage with expiration handling
      saveAuthToken(token, response.data.expires_at);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
    dispatch({ type: 'LOGOUT' });
    // Only redirect to login after logout
    window.location.href = '/login';
  };

  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    // If we have both token and user data, set them immediately
    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      } catch (error) {
        // If parsing fails, continue to API verification
      }
    }

    // Verify token with backend
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authApi.getCurrentUser();
      const user = response.data.data;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error: any) {
      // Only logout if token is actually invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      // Don't redirect here - let the App component handle it
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Register logout callback for token expiration handling
    setLogoutCallback(logout);
    
    // Set up periodic token expiration check (every 5 minutes)
    const tokenCheckInterval = setInterval(() => {
      if (state.isAuthenticated && isTokenExpired()) {
        console.log('🔒 Token expired during periodic check, logging out...');
        logout();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
    
    // Cleanup function to remove callback and interval when component unmounts
    return () => {
      clearLogoutCallback();
      clearInterval(tokenCheckInterval);
    };
  }, [state.isAuthenticated]); // Re-run if authentication status changes

  return (
    <AuthContext.Provider 
      value={{ 
        state, 
        dispatch, 
        permissions, 
        login, 
        logout, 
        checkAuth 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
