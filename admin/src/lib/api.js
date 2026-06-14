import axios from 'axios';
import { getAdminToken, clearAdminSession } from './authStorage';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAdminSession();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function adminLogin(email, password) {
  const { data } = await API.post('/auth/admin/login', { email, password });
  return data;
}

export async function validateSession() {
  const { data } = await API.get('/auth/me');
  return data.user;
}

export default API;
