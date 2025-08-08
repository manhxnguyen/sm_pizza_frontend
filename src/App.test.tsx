import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import App from './App';

// Mock the API context
jest.mock('./contexts/ApiContext', () => ({
  ApiProvider: ({ children }: { children: React.ReactNode }) => children,
  useApi: () => ({
    state: {
      toppings: [],
      pizzas: [],
      loading: false,
      error: null,
    },
    dispatch: jest.fn(),
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MantineProvider>
        {component}
      </MantineProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  test('renders without crashing', () => {
    renderWithProviders(<App />);
  });

  test('renders navigation elements', () => {
    renderWithProviders(<App />);
    expect(screen.getByText('Pizza Management System')).toBeInTheDocument();
  });
});
