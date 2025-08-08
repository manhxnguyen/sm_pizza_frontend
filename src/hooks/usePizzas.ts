import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useApi } from '../contexts/ApiContext';
import { pizzasApi } from '../services/api';
import { CreatePizzaRequest, UpdatePizzaRequest } from '../types';

export const usePizzas = () => {
  const { state, dispatch } = useApi();

  const fetchPizzas = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await pizzasApi.getAll();
      dispatch({ type: 'SET_PIZZAS', payload: response.data.data });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch pizzas';
      dispatch({ type: 'SET_ERROR', payload: message });
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const createPizza = useCallback(async (data: CreatePizzaRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await pizzasApi.create(data);
      
      // Check if the response includes complete topping data
      const newPizza = response.data.data;
      if (newPizza.toppings && newPizza.toppings.length > 0 && newPizza.toppings[0].name) {
        // Complete topping data is available, add immediately
        dispatch({ type: 'ADD_PIZZA', payload: newPizza });
      } else {
        // Incomplete topping data, fetch the full pizza details
        try {
          const fullPizzaResponse = await pizzasApi.getById(newPizza.id);
          dispatch({ type: 'ADD_PIZZA', payload: fullPizzaResponse.data.data });
        } catch (fetchError) {
          // If individual fetch fails, still add with what we have
          dispatch({ type: 'ADD_PIZZA', payload: newPizza });
        }
      }
      
      notifications.show({
        title: 'Success',
        message: 'Pizza created successfully',
        color: 'green',
      });
      
      return response.data.data;
    } catch (error: any) {
      // Handle specific error cases
      let message = 'Failed to create pizza';
      
      if (error.response?.status === 422) {
        // Handle validation errors
        message = error.response?.data?.message || error.response?.data?.error || 'Validation error - pizza name may already exist';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // For CRUD operations, only show notifications (no persistent error state)
      notifications.show({
        title: 'Error Creating Pizza',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const updatePizza = useCallback(async (id: number, data: UpdatePizzaRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await pizzasApi.update(id, data);
      
      // Check if the response includes complete topping data
      const updatedPizza = response.data.data;
      if (updatedPizza.toppings && updatedPizza.toppings.length > 0 && updatedPizza.toppings[0].name) {
        // Complete topping data is available, update immediately
        dispatch({ type: 'UPDATE_PIZZA', payload: updatedPizza });
      } else {
        // Incomplete topping data, fetch the full pizza details
        try {
          const fullPizzaResponse = await pizzasApi.getById(id);
          dispatch({ type: 'UPDATE_PIZZA', payload: fullPizzaResponse.data.data });
        } catch (fetchError) {
          // If individual fetch fails, still update with what we have
          dispatch({ type: 'UPDATE_PIZZA', payload: updatedPizza });
        }
      }
      
      notifications.show({
        title: 'Success',
        message: 'Pizza updated successfully',
        color: 'green',
      });
      
      return response.data.data;
    } catch (error: any) {
      // Handle specific error cases
      let message = 'Failed to update pizza';
      
      if (error.response?.status === 422) {
        // Handle validation errors
        message = error.response?.data?.message || error.response?.data?.error || 'Validation error - pizza name may already exist';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // For CRUD operations, only show notifications (no persistent error state)
      notifications.show({
        title: 'Error Updating Pizza',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      // Always clear loading state
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const deletePizza = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await pizzasApi.delete(id);
      dispatch({ type: 'DELETE_PIZZA', payload: id });
      notifications.show({
        title: 'Success',
        message: 'Pizza deleted successfully',
        color: 'green',
      });
    } catch (error: any) {
      // Handle specific error cases
      let message = 'Failed to delete pizza';
      
      if (error.response?.status === 422) {
        // Handle business logic errors
        message = error.response?.data?.message || error.response?.data?.error || 'Cannot delete pizza - it may have dependencies';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // For CRUD operations, only show notifications (no persistent error state)
      notifications.show({
        title: 'Cannot Delete Pizza',
        message,
        color: 'red',
      });
      
      // Don't re-throw the error to prevent uncaught runtime errors
      console.error('Delete pizza error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  return {
    pizzas: state.pizzas,
    loading: state.loading,
    error: state.error,
    fetchPizzas,
    createPizza,
    updatePizza,
    deletePizza,
  };
};
