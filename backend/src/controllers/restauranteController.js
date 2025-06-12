const { Restaurante, Cozinha, Produto } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // Criar restaurante
  async criar(req, res) {
    try {
      const { nome, cnpj, telefone, endereco, taxaFrete, ativo, aberto, imagemUrl, CozinhaId } = req.body;
      if (!nome || !CozinhaId) {
        return res.status(400).json({ erro: 'Nome e CozinhaId são obrigatórios.' });
      }
      const cozinhaExists = await Cozinha.findByPk(CozinhaId);
      if (!cozinhaExists) {
        return res.status(404).json({ erro: 'Tipo de Cozinha não encontrado.' });
      }
      const novoRestaurante = await Restaurante.create({
        nome, cnpj, telefone, endereco, taxaFrete: taxaFrete !== undefined ? parseFloat(taxaFrete) : 0.00,
        ativo: ativo !== undefined ? ativo : true, aberto: aberto !== undefined ? aberto : true,
        imagemUrl, CozinhaId, empresaId: req.user.id
      });
      res.status(201).json(novoRestaurante);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar restaurante', detalhes: error.message });
    }
  },

  // Listar restaurantes
  async listar(req, res) {
    try {
      const { empresaId, cozinhaId, aberto, entregaGratis, ativoOnly, search, orderBy, orderDirection = 'ASC' } = req.query;
      const whereClause = {};
      
      const includeClause = [{ model: Cozinha, as: 'tipoCozinha' }];

      if (empresaId) {
        whereClause.empresaId = empresaId;
      }

      if (cozinhaId) whereClause.CozinhaId = cozinhaId;
      if (aberto === 'true') whereClause.aberto = true;
      if (aberto === 'false') whereClause.aberto = false;
      if (entregaGratis === 'true') whereClause.taxaFrete = 0;
      if (ativoOnly === 'true' || ativoOnly === undefined) whereClause.ativo = true;
      if (search) {
        whereClause.nome = { [Op.like]: `%${search}%` };
      }
      
      let orderClause = [['nome', 'ASC']]; 
      if (orderBy && ['nome', 'taxaFrete'].includes(orderBy)) {
        orderClause = [[orderBy, orderDirection.toUpperCase()]];
      }

      const restaurantes = await Restaurante.findAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
      });

      res.json(restaurantes);
    } catch (error) {
      console.error("Erro ao listar restaurantes:", error);
      res.status(500).json({ erro: 'Erro ao buscar restaurantes', detalhes: error.message });
    }
  },

  // Buscar um restaurante por ID
  async buscarPorId(req, res) {
    try {
      const restaurante = await Restaurante.findByPk(req.params.id, {
        include: [
          { model: Cozinha, as: 'tipoCozinha' },
          { model: Produto, as: 'produtosOferecidos', where: { ativo: true }, required: false }
        ]
      });
      if (!restaurante) {
        return res.status(404).json({ erro: 'Restaurante não encontrado' });
      }
      res.json(restaurante);
    } catch (error) {
      console.error("Erro ao buscar restaurante por ID:", error);
      res.status(500).json({ erro: 'Erro ao buscar restaurante', detalhes: error.message });
    }
  },

  // Atualizar um restaurante
  async atualizar(req, res) {
    try {
      const restaurante = await Restaurante.findByPk(req.params.id);
      if (!restaurante) {
        return res.status(404).json({ erro: 'Restaurante não encontrado' });
      }
      if (req.user.permissoes && !req.user.permissoes.includes('MANAGE_SYSTEM') && restaurante.empresaId !== req.user.id) {
        return res.status(403).json({ erro: 'Você não tem permissão para editar este restaurante.' });
      }
      const { nome, cnpj, telefone, endereco, taxaFrete, ativo, aberto, imagemUrl, CozinhaId } = req.body;
      if (CozinhaId) {
        const cozinhaExists = await Cozinha.findByPk(CozinhaId);
        if (!cozinhaExists) {
          return res.status(404).json({ erro: 'Tipo de Cozinha não encontrado.' });
        }
        restaurante.CozinhaId = CozinhaId;
      }
      if (nome) restaurante.nome = nome;
      if (cnpj) restaurante.cnpj = cnpj;
      if (telefone) restaurante.telefone = telefone;
      if (endereco) restaurante.endereco = endereco;
      if (taxaFrete !== undefined) restaurante.taxaFrete = parseFloat(taxaFrete);
      if (ativo !== undefined) restaurante.ativo = ativo;
      if (aberto !== undefined) restaurante.aberto = aberto;
      if (imagemUrl !== undefined) restaurante.imagemUrl = imagemUrl;
      await restaurante.save();
      res.json(restaurante);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar restaurante', detalhes: error.message });
    }
  },

  // Remover um restaurante
  async remover(req, res) {
    try {
      const restaurante = await Restaurante.findByPk(req.params.id);
      if (!restaurante) {
        return res.status(404).json({ erro: 'Restaurante não encontrado' });
      }
      if (req.user.permissoes && !req.user.permissoes.includes('MANAGE_SYSTEM')) {
        return res.status(403).json({ erro: 'Apenas administradores podem remover restaurantes.' });
      }
      await restaurante.destroy();
      res.json({ mensagem: 'Restaurante removido com sucesso.' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover restaurante', detalhes: error.message });
    }
  }
};