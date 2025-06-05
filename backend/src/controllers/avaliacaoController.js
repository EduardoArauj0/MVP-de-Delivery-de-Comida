const { Avaliacao, Pedido, Restaurante, User } = require('../models');

module.exports = {
  // Criar avaliação
  async criar(req, res) {
    try {
      const { nota, comentario, PedidoId } = req.body;

      if (!nota || !PedidoId) {
        return res.status(400).json({ erro: 'Nota e PedidoId são obrigatórios.' });
      }
      if (nota < 1 || nota > 5) {
        return res.status(400).json({ erro: 'A nota deve ser entre 1 e 5.' });
      }

      const pedido = await Pedido.findByPk(PedidoId);
      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado para avaliação.' });
      }

      if (pedido.clienteId !== req.user.id) {
        return res.status(403).json({ erro: 'Você só pode avaliar pedidos feitos por você.' });
      }

      const avalExistente = await Avaliacao.findOne({ where: { PedidoId } });
        if (avalExistente) {
        return res.status(400).json({ erro: 'Este pedido já foi avaliado.' });
      }

      const avaliacao = await Avaliacao.create({ nota, comentario, PedidoId });
      res.status(201).json(avaliacao);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar avaliação', detalhes: error.message });
    }
  },

  // Listar todas as avaliações
  async listar(req, res) {
    try {
      const avaliacoes = await Avaliacao.findAll({
        include: [
          {
            model: Pedido,
            include: [
              { model: User, as: 'cliente', attributes: ['id', 'nome'] },
              { model: Restaurante, attributes: ['id', 'nome'] }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(avaliacoes);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar avaliações', detalhes: error.message });
    }
  },

  // Listar avaliações por RestauranteId
  async listarPorRestaurante(req, res) {
    try {
      const { restauranteId } = req.params;
      const restaurante = await Restaurante.findByPk(restauranteId);
      if (!restaurante) {
          return res.status(404).json({ erro: 'Restaurante não encontrado.' });
      }

      const avaliacoes = await Avaliacao.findAll({
        include: [{
          model: Pedido,
          where: { RestauranteId: restauranteId },
          attributes: ['id', 'dataCriacao'],
          include: [{ model: User, as: 'cliente', attributes: ['id', 'nome']}]
        }],
        order: [['createdAt', 'DESC']]
      });

      const totalNotas = avaliacoes.reduce((sum, aval) => sum + aval.nota, 0);
      const media = avaliacoes.length > 0 ? (totalNotas / avaliacoes.length).toFixed(1) : 0;

      res.json({ avaliacoes, mediaNotas: parseFloat(media)});
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar avaliações do restaurante', detalhes: error.message });
    }
  },

  // Buscar avaliação por ID
  async buscarPorId(req, res) {
    try {
      const avaliacao = await Avaliacao.findByPk(req.params.id, { include: Pedido });
      if (!avaliacao) {
        return res.status(404).json({ erro: 'Avaliação não encontrada.' });
      }
      res.json(avaliacao);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar avaliação', detalhes: error.message });
    }
  },

  // Atualizar avaliação
  async atualizar(req, res) {
    try {
      const avaliacao = await Avaliacao.findByPk(req.params.id, { include: Pedido });
      if (!avaliacao) {
        return res.status(404).json({ erro: 'Avaliação não encontrada.' });
      }

      if (avaliacao.Pedido.clienteId !== req.user.id) {
        return res.status(403).json({ erro: 'Você não tem permissão para atualizar esta avaliação.' });
      }

      const { nota, comentario } = req.body;
      if (nota !== undefined) {
        if (nota < 1 || nota > 5) return res.status(400).json({ erro: 'A nota deve ser entre 1 e 5.' });
        avaliacao.nota = nota;
      }
      if (comentario !== undefined) avaliacao.comentario = comentario;

      await avaliacao.save();
      res.json(avaliacao);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar avaliação', detalhes: error.message });
    }
  },

  // Remover avaliação
  async remover(req, res) {
    try {
      const avaliacao = await Avaliacao.findByPk(req.params.id, { include: Pedido });
      if (!avaliacao) {
        return res.status(404).json({ erro: 'Avaliação não encontrada.' });
      }

      if (avaliacao.Pedido.clienteId !== req.user.id && req.user.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Você não tem permissão para remover esta avaliação.' });
      }

      await avaliacao.destroy();
      res.json({ mensagem: 'Avaliação removida com sucesso.' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover avaliação', detalhes: error.message });
    }
  }
};