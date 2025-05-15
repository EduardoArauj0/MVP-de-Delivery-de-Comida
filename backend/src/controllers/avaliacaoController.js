const { Avaliacao, Pedido } = require('../models');

module.exports = {
  // Criar avaliação
  async criar(req, res) {
    try {
      const { nota, comentario, PedidoId } = req.body;

      // Verifica se pedido existe
      const pedido = await Pedido.findByPk(PedidoId);
      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado para avaliação' });
      }

      // Verifica se o pedido pertence ao usuário autenticado
      if (pedido.clienteId !== req.user.id) {
        return res.status(403).json({ erro: 'Você só pode avaliar pedidos feitos por você' });
      }

      // Verifica se já existe avaliação para esse pedido
      const avalExistente = await Avaliacao.findOne({ where: { PedidoId } });
      if (avalExistente) {
        return res.status(400).json({ erro: 'Pedido já avaliado' });
      }

      // Cria avaliação
      const avaliacao = await Avaliacao.create({ nota, comentario, PedidoId });
      res.status(201).json(avaliacao);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar avaliação', detalhes: error.message });
    }
  },

  // Listar avaliações
  async listar(req, res) {
    try {
      const avaliacoes = await Avaliacao.findAll();
      res.json(avaliacoes);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar avaliações' });
    }
  },

  // Buscar avaliação por ID
  async buscarPorId(req, res) {
    try {
      const avaliacao = await Avaliacao.findByPk(req.params.id);
      if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada' });
      res.json(avaliacao);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar avaliação' });
    }
  },

  // Atualizar avaliação
  async atualizar(req, res) {
    try {
      const avaliacao = await Avaliacao.findByPk(req.params.id);
      if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada' });

      await avaliacao.update(req.body);
      res.json(avaliacao);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar avaliação' });
    }
  },

  // Remover avaliação
  async remover(req, res) {
    try {
      const avaliacao = await Avaliacao.findByPk(req.params.id);
      if (!avaliacao) return res.status(404).json({ erro: 'Avaliação não encontrada' });

      await avaliacao.destroy();
      res.json({ mensagem: 'Avaliação removida com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover avaliação' });
    }
  }
};
