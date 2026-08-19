import api from './api';
import type { Budget } from '../types';

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    const res = await api.get('/budgets');
    return res.data;
  },

  getById: async (id: string): Promise<Budget> => {
    const res = await api.get(`/budgets/${id}`);
    return res.data;
  },

  create: async (data: Partial<Budget>) => {
    const res = await api.post('/budgets', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Budget>) => {
    const res = await api.put(`/budgets/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/budgets/${id}`);
    return res.data;
  },
};
