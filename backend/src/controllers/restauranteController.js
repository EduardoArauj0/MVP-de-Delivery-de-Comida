const { Restaurante } = require('../models');

module.exports = {
  // Criar restaurante
  async criar(req, res) {
    try {
      const { nome, cnpj, telefone, endereco } = req.body;

      const novo = await Restaurante.create({
        nome,
        cnpj,
        telefone,
        endereco,
        empresaId: req.user.id // vincula ao usuário autenticado
      });

      res.status(201).json(novo);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar restaurante', detalhes: error.message });
    }
  },

  // Listar todos
  async listar(req, res) {
    try {
      const lista = await Restaurante.findAll();
      res.json(lista);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar restaurantes' });
    }
  },

  // Buscar por ID
  async buscarPorId(req, res) {
    try {
      const restaurante = await Restaurante.findByPk(req.params.id);
      if (!restaurante) return res.status(404).json({ erro: 'Restaurante não encontrado' });
      res.json(restaurante);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar restaurante' });
    }
  },

  // Atualizar
  async atualizar(req, res) {
    try {
      const restaurante = await Restaurante.findByPk(req.params.id);
      if (!restaurante) return res.status(404).json({ erro: 'Restaurante não encontrado' });

      if (req.user.tipo !== 'admin' && restaurante.empresaId !== req.user.id) {
        return res.status(403).json({ erro: 'Você não tem permissão para editar este restaurante' });
      }

      await restaurante.update(req.body);
      res.json(restaurante);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar restaurante' });
    }
  },

  // Remover
  async remover(req, res) {
    try {
      const restaurante = await Restaurante.findByPk(req.params.id);
      if (!restaurante) return res.status(404).json({ erro: 'Restaurante não encontrado' });

      if (req.user.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Apenas administradores podem remover restaurantes' });
      }

      await restaurante.destroy();
      res.json({ mensagem: 'Restaurante removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover restaurante' });
    }
  }
};
