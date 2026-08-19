import api from './api';
import type { CategoryComparison, YearlyTrend } from '../types';

export const analyticsService = {
  getCategoryComparison: async (): Promise<CategoryComparison[]> => {
    const res = await api.get('/analytics/categories');
    return res.data;
  },

  getYearlyTrend: async (): Promise<YearlyTrend[]> => {
    const res = await api.get('/analytics/yearly');
    return res.data;
  },
};
