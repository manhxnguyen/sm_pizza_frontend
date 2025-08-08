import '@testing-library/jest-dom';

// Mock console.error to avoid noise in tests
(global as any).console.error = jest.fn();
