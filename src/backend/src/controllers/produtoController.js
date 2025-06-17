const { Produto, Restaurante } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // Criar produto
  async criar(req, res) {
    try {
      const { nome, descricao, imagem, preco, RestauranteId, categoria, ativo } = req.body;

      if (!nome || !preco || !RestauranteId || !categoria) {
        return res.status(400).json({ erro: 'Nome, preço, RestauranteId e categoria são obrigatórios.' });
      }

      const restaurante = await Restaurante.findByPk(RestauranteId);
      if (!restaurante) {
        return res.status(404).json({ erro: 'Restaurante não encontrado.' });
      }

      if (restaurante.empresaId !== req.user.id) {
        return res.status(403).json({ erro: 'Você não tem permissão para adicionar produtos a este restaurante.' });
      }

      const novoProduto = await Produto.create({
        nome,
        descricao,
        imagem,
        preco: parseFloat(preco),
        RestauranteId,
        categoria,
        ativo: ativo !== undefined ? ativo : true
      });
      res.status(201).json(novoProduto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar produto', detalhes: error.message });
    }
  },

  // Listar todos os produtos com filtros
  async listar(req, res) {
    try {
      const { RestauranteId, categoria, ativoOnly, search } = req.query;
      const whereClause = {};

      if (RestauranteId) whereClause.RestauranteId = RestauranteId;
      if (categoria) whereClause.categoria = { [Op.like]: `%${categoria}%` };
      if (ativoOnly === 'true' || ativoOnly === undefined) whereClause.ativo = true;

      if (search) {
        whereClause.nome = { [Op.like]: `%${search}%` };
      }

      const produtos = await Produto.findAll({
        where: whereClause,
        include: [{ model: Restaurante, as: 'restauranteProduto', attributes: ['id', 'nome'] }]
      });
      res.json(produtos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produtos', detalhes: error.message });
    }
  },

  // Buscar por ID
  async buscarPorId(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id, { 
        include: [{ model: Restaurante, as: 'restauranteProduto' }] 
      });
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }
      res.json(produto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produto', detalhes: error.message });
    }
  },

  // Atualizar produto
  async atualizar(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado.' });
      }

      const restaurante = await Restaurante.findByPk(produto.RestauranteId);

      if (restaurante.empresaId !== req.user.id) {
        return res.status(403).json({ erro: 'Você não tem permissão para editar este produto.' });
      }

      const { nome, descricao, imagem, preco, categoria, ativo } = req.body;

      if (nome) produto.nome = nome;
      if (descricao !== undefined) produto.descricao = descricao;
      if (imagem !== undefined) produto.imagem = imagem;
      if (preco !== undefined) produto.preco = parseFloat(preco);
      if (categoria) produto.categoria = categoria;
      if (ativo !== undefined) produto.ativo = ativo;

      await produto.save();
      res.json(produto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar produto', detalhes: error.message });
    }
  },

  // Remover produto
  async remover(req, res) {
    try {
      const produto = await Produto.findByPk(req.params.id);
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado.' });
      }

      const restaurante = await Restaurante.findByPk(produto.RestauranteId);

      if (restaurante.empresaId !== req.user.id) {
        return res.status(403).json({ erro: 'Você não tem permissão para remover este produto.' });
      }

      await produto.destroy();
      res.json({ mensagem: 'Produto removido com sucesso.' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover produto', detalhes: error.message });
    }
  }
};