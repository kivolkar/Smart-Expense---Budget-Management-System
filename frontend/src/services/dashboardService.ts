import api from './api';
import type { DashboardData } from '../types';

export const dashboardService = {
  getData: async (): Promise<DashboardData> => {
    const res = await api.get('/dashboard');
    return res.data;
  },
};
