import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

const API_BASE = '/api';

// Helper to make API calls
async function apiFetch(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

// Users API
export function useUsers() {
  return useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiFetch('/users'),
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: any) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/users'] }),
  });
}

// Transactions API
export function useTransactions() {
  return useQuery({
    queryKey: ['/api/transactions'],
    queryFn: () => apiFetch('/transactions'),
  });
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: (data: any) => apiFetch('/transactions', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
  });
}

// Stats API
export function useStats() {
  return useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => apiFetch('/stats'),
  });
}

// Settle API
export function useSettle() {
  return useMutation({
    mutationFn: (data: { userId: string; amount: number }) =>
      apiFetch('/settle', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
  });
}
