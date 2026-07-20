import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api', 
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' } 
});

export const generateBill = (data) => api.post('/billing/generate', data).then(r => r.data);
export const getBill = (orderId) => api.get(`/billing/${orderId}`).then(r => r.data);
export const markPaid = (billId) => api.patch(`/billing/${billId}/mark-paid`).then(r => r.data);
