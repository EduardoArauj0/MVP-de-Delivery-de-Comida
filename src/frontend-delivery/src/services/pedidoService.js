import apiClient from './api';

const pedidoService = {
  // pedidoData { clienteId, restauranteId, formaPagamentoId, itens: [{ produtoId, quantidade }] }
  criar: (pedidoData) => {
    return apiClient.post('/pedidos', pedidoData);
  },
  listar: () => {
    return apiClient.get('/pedidos');
  },
  buscarPorId: (id) => {
    return apiClient.get(`/pedidos/${id}`);
  },
  atualizarStatus: (id, statusData) => { // statusData: { status }
    return apiClient.put(`/pedidos/${id}/status`, statusData);
  },
  remover: (id) => { 
    return apiClient.delete(`/pedidos/${id}`);
  },
};

export default pedidoService;