import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signUpUser = async (name, email, password, confirmPassword) => {
  const response = await api.post('/auth/signup', { name, email, password, confirmPassword });
  return response.data;
};

export const signInUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getOrganization = async () => {
  const response = await api.get('/organizations');
  return response.data;
};
