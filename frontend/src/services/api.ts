import axios from 'axios';
import { 
  User, 
  Feedback, 
  DashboardData, 
  LoginCredentials, 
  RegisterData, 
  CreateFeedbackData, 
  UpdateFeedbackData,
  EnhancedTeamMember
} from '../types';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data, 'URL:', error.config?.url);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Feedback API
export const feedbackAPI = {
  getAll: () => api.get('/feedback/').then(res => res.data),
  
  getDashboard: () => api.get('/feedback/dashboard').then(res => res.data),
  
  submit: (data: any) => api.post('/feedback/', data).then(res => res.data),
  
  requestFeedback: (data: any) => api.post('/feedback/request', data).then(res => res.data),
  
  getRequests: () => api.get('/feedback/requests').then(res => res.data),
  
  submitComment: (feedbackId: number, data: any) => 
    api.post(`/feedback/${feedbackId}/comments`, data).then(res => res.data),
  
  exportPDF: (feedbackId: number) => 
    api.get(`/feedback/${feedbackId}/export`, { responseType: 'blob' }).then(res => res.data),
  
  getTeamMembers: () => api.get('/users/team').then(res => res.data),
  
  getByTags: (tags: string[]) => 
    api.get('/feedback/by-tags', { params: { tags: tags.join(',') } }).then(res => res.data),
};

// User API
export const userAPI = {
  getAll: () => api.get('/users/').then(res => res.data),
  
  getProfile: (id: number) => api.get(`/users/${id}`).then(res => res.data),
  
  updateProfile: (id: number, data: any) => api.put(`/users/${id}`, data).then(res => res.data),
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export const notificationAPI = {
  getAll: () => api.get('/notifications/').then(res => res.data),
  
  markAsRead: (id: number) => api.put(`/notifications/${id}/read`).then(res => res.data),
  
  send: (data: any) => api.post('/notifications/', data).then(res => res.data),
};

export default api; 