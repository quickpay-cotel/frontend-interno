import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL; // Reemplaza con tu URL base

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
