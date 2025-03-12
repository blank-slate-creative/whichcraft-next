export interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}
