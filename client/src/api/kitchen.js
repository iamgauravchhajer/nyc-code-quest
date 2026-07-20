import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api', 
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' } 
});

export const getPendingOrders = () => api.get('/kitchen/pending').then(r => r.data);
export const getCookingOrders = () => api.get('/kitchen/cooking').then(r => r.data);
export const markCooking = (id) => api.patch(`/kitchen/${id}/mark-cooking`).then(r => r.data);
export const markReady = (id) => api.patch(`/kitchen/${id}/mark-ready`).then(r => r.data);
export const markServed = (id) => api.patch(`/kitchen/${id}/mark-served`).then(r => r.data);
