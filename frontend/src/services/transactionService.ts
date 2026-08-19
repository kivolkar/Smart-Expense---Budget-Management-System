import api from './api';
import type { TransactionFilters, PaginatedTransactions } from '../types';

export const transactionService = {
  getAll: async (filters: TransactionFilters = {}): Promise<PaginatedTransactions> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const res = await api.get(`/transactions?${params.toString()}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },

  create: async (data: FormData) => {
    const res = await api.post('/transactions', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  update: async (id: string, data: FormData) => {
    const res = await api.put(`/transactions/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },

  getSummary: async () => {
    const res = await api.get('/transactions/summary');
    return res.data;
  },
};
