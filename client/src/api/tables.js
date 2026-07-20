import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api', 
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' } 
});

export const getTables = () => api.get('/tables').then(r => r.data);
export const createTable = (data) => api.post('/tables', data).then(r => r.data);
export const updateTable = (id, data) => api.put(`/tables/${id}`, data).then(r => r.data);
export const deleteTable = (id) => api.delete(`/tables/${id}`).then(r => r.data);
export const changeTableStatus = (id, status) => api.patch(`/tables/${id}/status`, { status }).then(r => r.data);
