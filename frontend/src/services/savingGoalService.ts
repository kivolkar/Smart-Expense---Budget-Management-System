import api from './api';
import type { SavingGoal } from '../types';

export const savingGoalService = {
  getAll: async (): Promise<SavingGoal[]> => {
    const res = await api.get('/saving-goals');
    return res.data;
  },

  getById: async (id: string): Promise<SavingGoal> => {
    const res = await api.get(`/saving-goals/${id}`);
    return res.data;
  },

  create: async (data: Partial<SavingGoal>) => {
    const res = await api.post('/saving-goals', data);
    return res.data;
  },

  update: async (id: string, data: Partial<SavingGoal>) => {
    const res = await api.put(`/saving-goals/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/saving-goals/${id}`);
    return res.data;
  },
};
