import api from './api';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types';

export const authService = {
  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  changePassword: async (data: any) => {
    const res = await api.put('/auth/password', data);
    return res.data;
  }
};
