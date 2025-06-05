import apiClient from './api';

const userService = {
  login: (credentials) => {
    return apiClient.post('/users/login', credentials);
  },
  register: (userData) => {
    return apiClient.post('/users/register', userData);
  },

  getAllUsers: () => {
    return apiClient.get('/users');
  },
  getUserById: (id) => {
    return apiClient.get(`/users/${id}`);
  },
  updateUser: (id, userData) => {
    return apiClient.put(`/users/${id}`, userData);
  },
  deleteUser: (id) => {
    return apiClient.delete(`/users/${id}`);
  },
};

export default userService;