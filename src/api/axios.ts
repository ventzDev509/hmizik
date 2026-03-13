import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: 'https://hmizikbackend-1.onrender.com',
});

// INTERCEPTOR POU VOYE TOKEN AN (REQUEST)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('h_mizik_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR POU JERE ERÈ 401 (RESPONSE)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('h_mizik_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;