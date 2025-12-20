export * from './types';
export * from './api-client';
export * from './beverage-api';
export * from './adapters/common';

// Re-export default configuration
export const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
