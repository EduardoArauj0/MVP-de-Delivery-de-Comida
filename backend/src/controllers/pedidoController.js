const { Pedido, ItemPedido, Produto, Restaurante, User, ModoPagamento } = require('../models');

module.exports = {
  // Criar pedido com itens
  async criar(req, res) {
    try {
      const { clienteId, restauranteId, formaPagamentoId, itens } = req.body;

      const pedido = await Pedido.create({ clienteId, RestauranteId: restauranteId, formaPagamentoId });

      for (const item of itens) {
        const { produtoId, quantidade } = item;
        await ItemPedido.create({
          PedidoId: pedido.id,
          ProdutoId: produtoId,
          quantidade
        });
      }

      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [Restaurante, ModoPagamento, { model: User, as: 'cliente' }, { model: ItemPedido, include: Produto }]
      });

      res.status(201).json(pedidoCompleto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar pedido', detalhes: error.message });
    }
  },

  // Listar todos os pedidos com detalhes
  async listar(req, res) {
    try {
      let pedidos;

      if (req.user.tipo === 'cliente') {
        pedidos = await Pedido.findAll({
          where: { clienteId: req.user.id },
          include: [Restaurante, ModoPagamento, { model: User, as: 'cliente' }, { model: ItemPedido, include: Produto }]
        });
      } else if (req.user.tipo === 'empresa') {
        pedidos = await Pedido.findAll({
          include: [
            {
              model: Restaurante,
              where: { userId: req.user.id }
            },
            ModoPagamento,
            { model: User, as: 'cliente' },
            { model: ItemPedido, include: Produto }
          ]
        });
      } else {
        pedidos = await Pedido.findAll({
          include: [Restaurante, ModoPagamento, { model: User, as: 'cliente' }, { model: ItemPedido, include: Produto }]
        });
      }

      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar pedidos' });
    }
  },

  // Buscar pedido por ID
  async buscarPorId(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id, {
        include: [Restaurante, ModoPagamento, { model: User, as: 'cliente' }, { model: ItemPedido, include: Produto }]
      });

      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

      if (req.user.tipo === 'cliente' && pedido.clienteId !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado a este pedido' });
      }

      if (req.user.tipo === 'empresa') {
        const restaurante = await Restaurante.findByPk(pedido.RestauranteId);
        if (restaurante.userId !== req.user.id) {
          return res.status(403).json({ erro: 'Acesso negado a este pedido' });
        }
      }

      res.json(pedido);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar pedido' });
    }
  },

  // Atualizar status do pedido
  async atualizarStatus(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

      pedido.status = req.body.status;
      await pedido.save();
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar pedido' });
    }
  },

  // Remover pedido (e itens)
  async remover(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

      await ItemPedido.destroy({ where: { PedidoId: pedido.id } });
      await pedido.destroy();

      res.json({ mensagem: 'Pedido removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover pedido' });
    }
  }
};
