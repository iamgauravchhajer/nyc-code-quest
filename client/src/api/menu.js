import axios from 'axios';

const api = axios.create({ 
  baseURL: '/api', 
  withCredentials: true, 
  headers: { 'Content-Type': 'application/json' } 
});

export const getMenuItems = () => api.get('/menu-items').then(r => r.data);
export const getMenuCategories = () => api.get('/menu-categories').then(r => r.data);
export const createMenuItem = (data) => api.post('/menu-items', data).then(r => r.data);
export const updateMenuItem = (id, data) => api.put(`/menu-items/${id}`, data).then(r => r.data);
export const deleteMenuItem = (id) => api.delete(`/menu-items/${id}`).then(r => r.data);
export const createMenuCategory = (data) => api.post('/menu-categories', data).then(r => r.data);
export const deleteMenuCategory = (id) => api.delete(`/menu-categories/${id}`).then(r => r.data);
