import { useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useApi } from '../contexts/ApiContext';
import { toppingsApi } from '../services/api';
import { CreateToppingRequest, UpdateToppingRequest } from '../types';

export const useToppings = () => {
  const { state, dispatch } = useApi();

  const fetchToppings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await toppingsApi.getAll();
      dispatch({ type: 'SET_TOPPINGS', payload: response.data.data });
    } catch (error: any) {
      let message = 'Failed to fetch toppings';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // For fetch errors, set both error state (for persistent Alert) and notification
      dispatch({ type: 'SET_ERROR', payload: `fetch: ${message}` });
      notifications.show({
        title: 'Error Loading Toppings',
        message,
        color: 'red',
      });
    } finally {
      // Always clear loading state
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const createTopping = useCallback(async (data: CreateToppingRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await toppingsApi.create(data);
      dispatch({ type: 'ADD_TOPPING', payload: response.data.data });
      notifications.show({
        title: 'Success',
        message: 'Topping created successfully',
        color: 'green',
      });
      return response.data.data;
    } catch (error: any) {
      // Handle specific error cases
      let message = 'Failed to create topping';
      
      if (error.response?.status === 422) {
        // Handle validation errors
        message = error.response?.data?.message || error.response?.data?.error || 'Validation error - topping may already exist';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // For CRUD operations, only show notifications (no persistent error state)
      notifications.show({
        title: 'Error Creating Topping',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      // Always clear loading state
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const updateTopping = useCallback(async (id: number, data: UpdateToppingRequest) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await toppingsApi.update(id, data);
      
      // Immediately update the topping in the state
      dispatch({ type: 'UPDATE_TOPPING', payload: response.data.data });
      
      notifications.show({
        title: 'Success',
        message: 'Topping updated successfully',
        color: 'green',
      });
      
      return response.data.data;
    } catch (error: any) {
      // Handle specific error cases
      let message = 'Failed to update topping';
      
      if (error.response?.status === 422) {
        // Handle validation errors
        message = error.response?.data?.message || error.response?.data?.error || 'Validation error - topping name may already exist';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // For CRUD operations, only show notifications (no persistent error state)
      notifications.show({
        title: 'Error Updating Topping',
        message,
        color: 'red',
      });
      throw error;
    } finally {
      // Always clear loading state
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const deleteTopping = useCallback(async (id: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await toppingsApi.delete(id);
      dispatch({ type: 'DELETE_TOPPING', payload: id });
      notifications.show({
        title: 'Success',
        message: 'Topping deleted successfully',
        color: 'green',
      });
    } catch (error: any) {
      // Handle specific error cases
      let message = 'Failed to delete topping';
      
      if (error.response?.status === 422) {
        // Handle business logic errors (like topping being used by pizzas)
        message = error.response?.data?.message || error.response?.data?.error || 'Cannot delete topping - it may be in use by existing pizzas';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      // For CRUD operations, only show notifications (no persistent error state)
      notifications.show({
        title: 'Cannot Delete Topping',
        message,
        color: 'red',
      });
      
      // Don't re-throw the error to prevent uncaught runtime errors
      console.error('Delete topping error:', error);
    } finally {
      // Always clear loading state
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  return {
    toppings: state.toppings,
    loading: state.loading,
    error: state.error,
    fetchToppings,
    createTopping,
    updateTopping,
    deleteTopping,
  };
};
