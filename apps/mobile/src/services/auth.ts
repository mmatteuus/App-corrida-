import api from './api';
import * as SecureStore from 'expo-secure-store';
import { CreateUser, Login, AuthResponse } from '@conexao-ativa/shared';

export const authService = {
  async login(credentials: Login): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    const data = response.data;
    
    if (data.success && data.data) {
      await SecureStore.setItemAsync('accessToken', data.data.token);
      await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
    }
    
    return data;
  },

  async signup(userData: CreateUser): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', userData);
    const data = response.data;
    
    if (data.success && data.data) {
      await SecureStore.setItemAsync('accessToken', data.data.token);
      await SecureStore.setItemAsync('refreshToken', data.data.refreshToken);
    }
    
    return data;
  },

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
  },

  async getStoredToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('accessToken');
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getStoredToken();
    return !!token;
  }
};

