import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = __DEV__ ? 'http://localhost:3000' : 'https://your-api-url.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com respostas
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, tentar renovar
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          // Implementar renovação de token aqui se necessário
          // Por enquanto, apenas limpar tokens e redirecionar para login
          await SecureStore.deleteItemAsync('accessToken');
          await SecureStore.deleteItemAsync('refreshToken');
        }
      } catch (refreshError) {
        console.error('Erro ao renovar token:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

