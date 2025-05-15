const { ModoPagamento } = require('../models');

module.exports = {
  // Criar
  async criar(req, res) {
    try {
      const modo = await ModoPagamento.create(req.body);
      res.status(201).json(modo);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar modo de pagamento', detalhes: error.message });
    }
  },

  // Listar
  async listar(req, res) {
    try {
      const modos = await ModoPagamento.findAll();
      res.json(modos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar modos de pagamento' });
    }
  },

  // Buscar por ID
  async buscarPorId(req, res) {
    try {
      const modo = await ModoPagamento.findByPk(req.params.id);
      if (!modo) return res.status(404).json({ erro: 'Modo de pagamento não encontrado' });
      res.json(modo);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar modo de pagamento' });
    }
  },

  // Atualizar
  async atualizar(req, res) {
    try {
      const modo = await ModoPagamento.findByPk(req.params.id);
      if (!modo) return res.status(404).json({ erro: 'Modo de pagamento não encontrado' });

      await modo.update(req.body);
      res.json(modo);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar modo de pagamento' });
    }
  },

  // Remover
  async remover(req, res) {
    try {
      const modo = await ModoPagamento.findByPk(req.params.id);
      if (!modo) return res.status(404).json({ erro: 'Modo de pagamento não encontrado' });

      await modo.destroy();
      res.json({ mensagem: 'Modo de pagamento removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover modo de pagamento' });
    }
  }
};
