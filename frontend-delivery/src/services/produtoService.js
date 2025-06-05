import apiClient from './api';

const produtoService = {
  // params { RestauranteId, categoria, ativoOnly, search }
  listar: (params) => {
    return apiClient.get('/produtos', { params });
  },
  buscarPorId: (id) => {
    return apiClient.get(`/produtos/${id}`);
  },
  // produtoData { nome, preco, RestauranteId, categoria, etc. }
  criar: (produtoData) => {
    return apiClient.post('/produtos', produtoData);
  },
  atualizar: (id, produtoData) => {
    return apiClient.put(`/produtos/${id}`, produtoData);
  },
  remover: (id) => {
    return apiClient.delete(`/produtos/${id}`);
  },
};

export default produtoService;