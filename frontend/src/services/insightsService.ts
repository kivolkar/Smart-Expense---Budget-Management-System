import api from './api';
import type { Insight } from '../types';

export const insightsService = {
  getAll: async (): Promise<Insight[]> => {
    const res = await api.get('/insights');
    return res.data;
  },
};
