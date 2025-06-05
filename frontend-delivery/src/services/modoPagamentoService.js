import apiClient from './api';

const modoPagamentoService = {
  listar: () => {
    return apiClient.get('/modospagamento');
  },
};

export default modoPagamentoService;