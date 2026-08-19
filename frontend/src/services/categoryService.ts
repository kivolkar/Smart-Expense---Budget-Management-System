import api from './api';
import type { Category } from '../types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get('/categories');
    return res.data;
  },

  create: async (data: Partial<Category>) => {
    const res = await api.post('/categories', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Category>) => {
    const res = await api.put(`/categories/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};
