import apiClient from './api';

const carrinhoService = {
  obterCarrinho: (clienteId) => {
    return apiClient.get(`/carrinho/${clienteId}`);
  },
  adicionarItem: (clienteId, itemData) => { // itemData: { produtoId, quantidade }
    return apiClient.post(`/carrinho/${clienteId}/itens`, itemData);
  },
  atualizarItem: (clienteId, itemId, quantidadeData) => { // quantidadeData: { quantidade }
    return apiClient.put(`/carrinho/${clienteId}/itens/${itemId}`, quantidadeData);
  },
  removerItem: (clienteId, itemId) => {
    return apiClient.delete(`/carrinho/${clienteId}/itens/${itemId}`);
  },
  limparCarrinho: (clienteId) => {
    return apiClient.delete(`/carrinho/${clienteId}`);
  },
};

export default carrinhoService;