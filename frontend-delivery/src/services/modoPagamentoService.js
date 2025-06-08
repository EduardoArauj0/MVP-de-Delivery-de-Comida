import apiClient from './api';

const modoPagamentoService = {
  listar: () => {
    return apiClient.get('/modospagamento');
  },
  criar: (data) => {
    return apiClient.post('/modospagamento', data);
  },
  atualizar: (id, data) => {
    return apiClient.put(`/modospagamento/${id}`, data);
  },
  remover: (id) => {
    return apiClient.delete(`/modospagamento/${id}`);
  },
};

export default modoPagamentoService;