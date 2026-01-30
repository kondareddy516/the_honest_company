import axios from 'axios';

const API = axios.create({
    baseURL: '/api' 
});
API.defaults.withCredentials = true; // include httpOnly cookie credentials

export const fetchProjects = () => API.get('/projects');
export const createProject = (formData) => API.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProject = (id, formData) => API.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProject = (id) => API.delete(`/projects/${id}`);

export const fetchClients = () => API.get('/clients');
export const createClient = (formData) => API.post('/clients', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateClient = (id, formData) => API.put(`/clients/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteClient = (id) => API.delete(`/clients/${id}`);

export const submitContact = (data) => API.post('/contact', data);
export const fetchContacts = () => API.get('/contacts');

export const subscribeNewsletter = (email) => API.post('/subscribe', { email });
export const fetchSubscribers = () => API.get('/subscribers');

// Auth
export const login = (username, password) => API.post('/auth/login', { username, password });
export const verifyAuth = () => API.get('/auth/verify');
export const logout = () => API.post('/auth/logout');

export default API;
