import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api', 
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' } 
});

export const getDashboardStats = () => api.get('/dashboard/stats').then(r => r.data);
export const getPopularItems = () => api.get('/dashboard/popular-items').then(r => r.data);
