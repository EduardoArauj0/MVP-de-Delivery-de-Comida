import apiClient from './api';

const cozinhaService = {
  listar: () => {
    return apiClient.get('/cozinhas');
  },
  criar: (cozinhaData) => {
    return apiClient.post('/cozinhas', cozinhaData);
  },
  buscarPorId: (id) => {
    return apiClient.get(`/cozinhas/${id}`);
  },
  atualizar: (id, cozinhaData) => {
    return apiClient.put(`/cozinhas/${id}`, cozinhaData);
  },
  remover: (id) => {
    return apiClient.delete(`/cozinhas/${id}`);
  },
};

export default cozinhaService;