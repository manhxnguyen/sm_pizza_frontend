import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Topping, Pizza } from '../types';

interface ApiState {
  toppings: Topping[];
  pizzas: Pizza[];
  loading: boolean;
  error: string | null;
}

type ApiAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TOPPINGS'; payload: Topping[] }
  | { type: 'SET_PIZZAS'; payload: Pizza[] }
  | { type: 'ADD_TOPPING'; payload: Topping }
  | { type: 'UPDATE_TOPPING'; payload: Topping }
  | { type: 'DELETE_TOPPING'; payload: number }
  | { type: 'ADD_PIZZA'; payload: Pizza }
  | { type: 'UPDATE_PIZZA'; payload: Pizza }
  | { type: 'DELETE_PIZZA'; payload: number };

const initialState: ApiState = {
  toppings: [],
  pizzas: [],
  loading: false,
  error: null,
};

function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TOPPINGS':
      return { ...state, toppings: action.payload.filter(Boolean), loading: false, error: null };
    case 'SET_PIZZAS':
      return { ...state, pizzas: action.payload.filter(Boolean), loading: false, error: null };
    case 'ADD_TOPPING':
      return { 
        ...state, 
        toppings: action.payload ? [...state.toppings, action.payload] : state.toppings,
        loading: false,
        error: null
      };
    case 'UPDATE_TOPPING':
      return {
        ...state,
        toppings: state.toppings.map(t => 
          t && action.payload && t.id === action.payload.id ? action.payload : t
        ).filter(Boolean),
        loading: false,
        error: null
      };
    case 'DELETE_TOPPING':
      return {
        ...state,
        toppings: state.toppings.filter(t => t && t.id !== action.payload),
        loading: false,
        error: null
      };
    case 'ADD_PIZZA':
      return { 
        ...state, 
        pizzas: action.payload ? [...state.pizzas, action.payload] : state.pizzas,
        loading: false,
        error: null
      };
    case 'UPDATE_PIZZA':
      return {
        ...state,
        pizzas: state.pizzas.map(p => 
          p && action.payload && p.id === action.payload.id ? action.payload : p
        ).filter(Boolean),
        loading: false,
        error: null
      };
    case 'DELETE_PIZZA':
      return {
        ...state,
        pizzas: state.pizzas.filter(p => p && p.id !== action.payload),
        loading: false,
        error: null
      };
    default:
      return state;
  }
}

interface ApiContextType {
  state: ApiState;
  dispatch: React.Dispatch<ApiAction>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  return (
    <ApiContext.Provider value={{ state, dispatch }}>
      {children}
    </ApiContext.Provider>
  );
};
