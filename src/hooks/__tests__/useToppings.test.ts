import { renderHook, act } from '@testing-library/react';
import { useToppings } from '../useToppings';
import { toppingsApi } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockedToppingsApi = toppingsApi as jest.Mocked<typeof toppingsApi>;

// Mock the notifications
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
  },
}));

// Mock the API context
const mockDispatch = jest.fn();
jest.mock('../../contexts/ApiContext', () => ({
  useApi: () => ({
    state: {
      toppings: [],
      loading: false,
      error: null,
    },
    dispatch: mockDispatch,
  }),
}));

describe('useToppings Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetchToppings dispatches correct actions on success', async () => {
    const mockToppings = [
      { id: 1, name: 'Pepperoni', created_at: '2023-01-01', updated_at: '2023-01-01' },
      { id: 2, name: 'Mushrooms', created_at: '2023-01-01', updated_at: '2023-01-01' },
    ];

    mockedToppingsApi.getAll.mockResolvedValue({
      data: { data: mockToppings },
    } as any);

    const { result } = renderHook(() => useToppings());

    await act(async () => {
      await result.current.fetchToppings();
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_LOADING', payload: true });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_TOPPINGS', payload: mockToppings });
  });

  test('createTopping dispatches correct actions on success', async () => {
    const newTopping = { id: 3, name: 'Cheese', created_at: '2023-01-01', updated_at: '2023-01-01' };
    
    mockedToppingsApi.create.mockResolvedValue({
      data: { data: newTopping },
    } as any);

    const { result } = renderHook(() => useToppings());

    await act(async () => {
      await result.current.createTopping({ name: 'Cheese' });
    });

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_LOADING', payload: true });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'ADD_TOPPING', payload: newTopping });
  });
});
