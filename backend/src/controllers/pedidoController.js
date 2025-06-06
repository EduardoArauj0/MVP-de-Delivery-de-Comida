const { Pedido, ItemPedido, Produto, Restaurante, User, ModoPagamento, Avaliacao } = require('../models');

const includeOptions = [
  { model: Restaurante, as: 'restaurantePedido' },
  { model: ModoPagamento, as: 'metodoPagamento' },
  { model: User, as: 'usuarioCliente', attributes: ['id', 'nome', 'email'] },
  { model: ItemPedido, as: 'itensDoPedido', include: [{ model: Produto, as: 'produtoItem' }] },
  { model: Avaliacao, as: 'avaliacaoFeita', required: false }
];

module.exports = {
  // Criar pedido com itens
  async criar(req, res) {
    try {
      const { clienteId, restauranteId, formaPagamentoId, itens } = req.body;

      if(req.user.id !== clienteId) {
          return res.status(403).json({ erro: 'Você só pode criar pedidos para si mesmo.' });
      }

      const pedido = await Pedido.create({ clienteId, RestauranteId: restauranteId, formaPagamentoId });

      for (const item of itens) {
        const { produtoId, quantidade } = item;
        const produto = await Produto.findByPk(produtoId);
        if(!produto) throw new Error(`Produto com ID ${produtoId} não encontrado.`);
        
        await ItemPedido.create({
          PedidoId: pedido.id,
          ProdutoId: produtoId,
          quantidade,
          precoUnitario: produto.preco
        });
      }

      const pedidoCompleto = await Pedido.findByPk(pedido.id, { include: includeOptions });

      res.status(201).json(pedidoCompleto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar pedido', detalhes: error.message });
    }
  },

  // Listar todos os pedidos com detalhes
  async listar(req, res) {
    try {
      let whereClause = {};

      if (req.user.tipo === 'cliente') {
        whereClause.clienteId = req.user.id;
      } else if (req.user.tipo === 'empresa') {
        const restaurantesDaEmpresa = await Restaurante.findAll({ 
            where: { empresaId: req.user.id }, 
            attributes: ['id'] 
        });
        const restauranteIds = restaurantesDaEmpresa.map(r => r.id);
        whereClause.RestauranteId = restauranteIds;
      }
      
      const pedidos = await Pedido.findAll({ where: whereClause, include: includeOptions, order: [['createdAt', 'DESC']] });
      res.json(pedidos);

    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar pedidos', detalhes: error.message });
    }
  },

  // Buscar pedido por ID
  async buscarPorId(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id, { include: includeOptions });

      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

      const isOwner = req.user.tipo === 'cliente' && pedido.clienteId === req.user.id;
      const isAdmin = req.user.tipo === 'admin';
      const isEmpresaDoPedido = req.user.tipo === 'empresa' && pedido.restaurantePedido.empresaId === req.user.id;
      
      if (!isOwner && !isAdmin && !isEmpresaDoPedido) {
        return res.status(403).json({ erro: 'Acesso negado a este pedido' });
      }
      
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar pedido', detalhes: error.message });
    }
  },

  // Atualizar status do pedido
  async atualizarStatus(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id, { include: [{ model: Restaurante, as: 'restaurantePedido' }] });
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

      if (pedido.restaurantePedido.empresaId !== req.user.id) {
          return res.status(403).json({ erro: 'Acesso negado.'});
      }

      pedido.status = req.body.status;
      await pedido.save();
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar pedido', detalhes: error.message });
    }
  },

  // Remover pedido (e itens)
  async remover(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
      
      if (pedido.clienteId !== req.user.id) {
          return res.status(403).json({ erro: 'Acesso negado.'});
      }

      await ItemPedido.destroy({ where: { PedidoId: pedido.id } });
      await pedido.destroy();

      res.json({ mensagem: 'Pedido removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover pedido', detalhes: error.message });
    }
  }
};