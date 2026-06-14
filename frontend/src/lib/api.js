// Central Axios API client pointing to Express backend
import axios from 'axios';
import { supabase } from './supabase';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
});

// Attach Supabase access token on every request if available
API.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Global response error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, redirect to login page
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/** Ping the backend health endpoint */
export async function checkBackendHealth() {
  try {
    const { data } = await axios.get(`${BASE_URL}/health`, { timeout: 4000 });
    return data?.status === 'ok';
  } catch {
    return false;
  }
}

export default API;
