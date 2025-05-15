const { Produto, Restaurante } = require('../models');

module.exports = {
  // Criar produto
  async criar(req, res) {
    try {
      const { nome, descricao, imagem, preco, RestauranteId } = req.body;

      const restaurante = await Restaurante.findByPk(RestauranteId);
      if (!restaurante) {
        return res.status(404).json({ erro: 'Restaurante não encontrado' });
      }

      const novoProduto = await Produto.create({ nome, descricao, imagem, preco, RestauranteId });
      res.status(201).json(novoProduto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar produto', detalhes: error.message });
    }
  },

  // Listar todos
  async listar(req, res) {
    try {
      const produtos = await Produto.findAll({ include: Restaurante });
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
  },

  // Buscar por ID
  async buscarPorId(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id, { include: Restaurante });
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
      res.json(produto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
  },

  // Atualizar
  async atualizar(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

      await produto.update(req.body);
      res.json(produto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
  },

  // Remover
  async remover(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

      await produto.destroy();
      res.json({ mensagem: 'Produto removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover produto' });
    }
  }
};
