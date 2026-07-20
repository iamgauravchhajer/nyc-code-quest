import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api', 
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' } 
});

export const getOrders = (params) => api.get('/orders', { params }).then(r => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then(r => r.data);
export const createOrder = (data) => api.post('/orders', data).then(r => r.data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data).then(r => r.data);
export const changeOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status }).then(r => r.data);
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`).then(r => r.data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`).then(r => r.data);
