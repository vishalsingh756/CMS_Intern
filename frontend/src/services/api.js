import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => apiClient.get('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data),
  verifyEmail: (data) => apiClient.post('/auth/verify-email', data),
  resendVerification: (data) => apiClient.post('/auth/resend-verification', data),
  googleLogin: (token) => apiClient.post('/auth/google', { token }),
};

export const clientService = {
  createClient: (data) => apiClient.post('/clients', data),
  updateClient: (id, data) => apiClient.put(`/clients/${id}`, data),
  deleteClient: (id) => apiClient.delete(`/clients/${id}`),
  getClient: (id) => apiClient.get(`/clients/${id}`),
  getClients: (params) => apiClient.get('/clients', { params }),
  getClientStats: () => apiClient.get('/clients/stats'),
};

export const dealService = {
  createDeal: (data) => apiClient.post('/deals', data),
  updateDeal: (id, data) => apiClient.put(`/deals/${id}`, data),
  deleteDeal: (id) => apiClient.delete(`/deals/${id}`),
  getDeal: (id) => apiClient.get(`/deals/${id}`),
  getDeals: (params) => apiClient.get('/deals', { params }),
  getDealStats: () => apiClient.get('/deals/stats'),
};

export const taskService = {
  createTask: (data) => apiClient.post('/tasks', data),
  updateTask: (id, data) => apiClient.put(`/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  getTask: (id) => apiClient.get(`/tasks/${id}`),
  getTasks: (params) => apiClient.get('/tasks', { params }),
  getMyTasks: (params) => apiClient.get('/tasks/my', { params }),
  getTaskStats: () => apiClient.get('/tasks/stats'),
};

export const interactionService = {
  createInteraction: (data) => apiClient.post('/interactions', data),
  updateInteraction: (id, data) => apiClient.put(`/interactions/${id}`, data),
  deleteInteraction: (id) => apiClient.delete(`/interactions/${id}`),
  getInteractions: (params) => apiClient.get('/interactions', { params }),
  getClientInteractions: (clientId, params) => apiClient.get(`/interactions/client/${clientId}`, { params }),
};

export const userService = {
  getAllUsers: (params) => apiClient.get('/users', { params }),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};

export const reportService = {
  createReport:  (data)         => apiClient.post('/reports', data),
  getReports:    ()             => apiClient.get('/reports'),
  getReport:     (id)           => apiClient.get(`/reports/${id}`),
  updateReport:  (id, data)     => apiClient.put(`/reports/${id}`, data),
  deleteReport:  (id)           => apiClient.delete(`/reports/${id}`),
  runAdHoc:      (config, params) => apiClient.post('/reports/run', config, { params }),
  runSaved:      (id, params)   => apiClient.post(`/reports/${id}/run`, {}, { params }),
};

export const activityService = {
  getLogs: (params) => apiClient.get('/activity', { params }),
};

export const dashboardService = {
  getOverview: () => apiClient.get('/dashboard/overview'),
};


export const noteService = {
  createNote:   (data) => apiClient.post('/notes', data),
  getNotes:     (params) => apiClient.get('/notes', { params }),
  updateNote:   (id, data) => apiClient.put(`/notes/${id}`, data),
  deleteNote:   (id) => apiClient.delete(`/notes/${id}`),
  togglePin:    (id) => apiClient.put(`/notes/${id}/pin`),
};

export const searchService = {
  search: (q) => apiClient.get('/search', { params: { q } }),
};

export default apiClient;
