import apiClient from './api';

const uploadService = {
  uploadImagem: (formData) => { 
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  },
};

export default uploadService;