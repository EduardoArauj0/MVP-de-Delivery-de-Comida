import apiClient from './api';

const grupoService = {
  listar: () => {
    return apiClient.get('/grupos');
  }
};

export default grupoService;