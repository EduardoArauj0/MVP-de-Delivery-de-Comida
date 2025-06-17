import apiClient from './api';

const avaliacaoService = {
  // avaliacaoData { nota, comentario, PedidoId }
  criar: (avaliacaoData) => {
    return apiClient.post('/avaliacoes', avaliacaoData);
  },
  listarTodas: () => { 
    return apiClient.get('/avaliacoes');
  },
  listarPorRestaurante: (restauranteId) => {
    return apiClient.get(`/avaliacoes/restaurante/${restauranteId}`);
  },
  buscarPorId: (id) => {
    return apiClient.get(`/avaliacoes/${id}`);
  },
  atualizar: (id, avaliacaoData) => { 
    return apiClient.put(`/avaliacoes/${id}`, avaliacaoData);
  },
  remover: (id) => { 
    return apiClient.delete(`/avaliacoes/${id}`);
  },
};

export default avaliacaoService;