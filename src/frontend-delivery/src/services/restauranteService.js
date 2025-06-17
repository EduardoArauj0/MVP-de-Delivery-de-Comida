import apiClient from './api';

const restauranteService = {
  // params { cozinhaId, aberto, entregaGratis, search, orderBy, orderDirection }
  listar: (params) => {
    return apiClient.get('/restaurantes', { params });
  },
  buscarPorId: (id) => {
    return apiClient.get(`/restaurantes/${id}`);
  },
  // restauranteData { nome, CozinhaId, taxaFrete, etc. }
  criar: (restauranteData) => {
    return apiClient.post('/restaurantes', restauranteData);
  },
  atualizar: (id, restauranteData) => {
    return apiClient.put(`/restaurantes/${id}`, restauranteData);
  },
  remover: (id) => {
    return apiClient.delete(`/restaurantes/${id}`);
  },
};

export default restauranteService;