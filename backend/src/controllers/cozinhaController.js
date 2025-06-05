const { Cozinha } = require('../models');

module.exports = {
  // Criar Cozinha (admin)
  async criar(req, res) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ erro: 'O nome da cozinha é obrigatório.' });
      }
      const cozinhaExistente = await Cozinha.findOne({ where: { nome } });
      if (cozinhaExistente) {
        return res.status(400).json({ erro: 'Já existe uma cozinha com este nome.' });
      }
      const cozinha = await Cozinha.create({ nome });
      res.status(201).json(cozinha);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar cozinha', detalhes: error.message });
    }
  },

  // Listar todas as Cozinhas
  async listar(req, res) {
    try {
      const cozinhas = await Cozinha.findAll({ order: [['nome', 'ASC']] });
      res.json(cozinhas);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar cozinhas', detalhes: error.message });
    }
  },

  // Buscar Cozinha por ID (admin)
  async buscarPorId(req, res) {
    try {
      const cozinha = await Cozinha.findByPk(req.params.id);
      if (!cozinha) {
        return res.status(404).json({ erro: 'Cozinha não encontrada.' });
      }
      res.json(cozinha);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar cozinha', detalhes: error.message });
    }
  },

  // Atualizar Cozinha (admin)
  async atualizar(req, res) {
    try {
      const { nome } = req.body;
      const cozinha = await Cozinha.findByPk(req.params.id);
      if (!cozinha) {
        return res.status(404).json({ erro: 'Cozinha não encontrada.' });
      }
      if (nome) {
        const cozinhaExistente = await Cozinha.findOne({ where: { nome } });
        if (cozinhaExistente && cozinhaExistente.id !== parseInt(req.params.id)) {
          return res.status(400).json({ erro: 'Já existe outra cozinha com este nome.' });
        }
        cozinha.nome = nome;
      }
      await cozinha.save();
      res.json(cozinha);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar cozinha', detalhes: error.message });
    }
  },

  // Remover Cozinha (admin)
  async remover(req, res) {
    try {
      const cozinha = await Cozinha.findByPk(req.params.id);
      if (!cozinha) {
        return res.status(404).json({ erro: 'Cozinha não encontrada.' });
      }
      await cozinha.destroy();
      res.json({ mensagem: 'Cozinha removida com sucesso.' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover cozinha', detalhes: error.message });
    }
  }
};