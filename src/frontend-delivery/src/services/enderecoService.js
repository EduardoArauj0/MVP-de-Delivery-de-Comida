import apiClient from './api';

const enderecoService = {
  listarMeus: () => {
    return apiClient.get('/enderecos/meus');
  },
  criar: (enderecoData) => {
    return apiClient.post('/enderecos', enderecoData);
  },
  atualizar: (id, enderecoData) => {
    return apiClient.put(`/enderecos/${id}`, enderecoData);
  },
  remover: (id) => {
    return apiClient.delete(`/enderecos/${id}`);
  },
};

export default enderecoService;