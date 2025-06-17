const { Pedido, ItemPedido, Produto, Restaurante, User, ModoPagamento, Avaliacao, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

const includeOptions = [
  { model: Restaurante, as: 'restaurantePedido' },
  { model: ModoPagamento, as: 'metodoPagamento' },
  { model: User, as: 'usuarioCliente', attributes: ['id', 'nome', 'email'] },
  { model: ItemPedido, as: 'itensDoPedido', include: [{ model: Produto, as: 'produtoItem' }] },
  { model: Avaliacao, as: 'avaliacaoFeita', required: false }
];

module.exports = {
  async criar(req, res) {
    const t = await sequelize.transaction();
    try {
      const { clienteId, restauranteId, formaPagamentoId, itens, enderecoEntrega, observacao } = req.body;
      if(req.user.id !== clienteId) {
          await t.rollback();
          return res.status(403).json({ erro: 'Você só pode criar pedidos para si mesmo.' });
      }
      if (!itens || itens.length === 0) {
          await t.rollback();
          return res.status(400).json({ erro: 'O pedido precisa conter pelo menos um item.' });
      }
      if (!enderecoEntrega) {
          await t.rollback();
          return res.status(400).json({ erro: 'O endereço de entrega é obrigatório.' });
      }
      const restaurante = await Restaurante.findByPk(restauranteId, { transaction: t });
      if (!restaurante) throw new Error('Restaurante não encontrado.');

      if (!restaurante.aberto) {
          await t.rollback();
          return res.status(400).json({ erro: 'Este restaurante está fechado e não está aceitando pedidos no momento.' });
      }

      const produtoIds = itens.map(item => item.produtoId);
      const produtosDoBanco = await Produto.findAll({ where: { id: produtoIds }, transaction: t });
      let subtotal = 0;
      for (const item of itens) {
        const produtoCorrespondente = produtosDoBanco.find(p => p.id === item.produtoId);
        if (!produtoCorrespondente) throw new Error(`Produto com ID ${item.produtoId} não encontrado.`);
        subtotal += item.quantidade * produtoCorrespondente.preco;
      }
      const taxaFrete = restaurante.taxaFrete;
      const valorTotal = subtotal + parseFloat(taxaFrete);
      const codigoPedido = `BR${Date.now()}${uuidv4().substring(0, 4).toUpperCase()}`;
      const pedido = await Pedido.create({
        codigo: codigoPedido, clienteId, RestauranteId: restauranteId, formaPagamentoId,
        enderecoEntrega, subtotal, taxaFrete, valorTotal, status: 'pendente', observacao
      }, { transaction: t });
      const itensParaCriar = itens.map(item => {
        const produtoCorrespondente = produtosDoBanco.find(p => p.id === item.produtoId);
        return {
          PedidoId: pedido.id, ProdutoId: item.produtoId, quantidade: item.quantidade,
          precoUnitario: produtoCorrespondente.preco, precoTotal: item.quantidade * produtoCorrespondente.preco,
          observacao: item.observacao || null,
        };
      });
      await ItemPedido.bulkCreate(itensParaCriar, { transaction: t });
      await t.commit();
      const pedidoCompleto = await Pedido.findByPk(pedido.id, { include: includeOptions });
      res.status(201).json(pedidoCompleto);
    } catch (error) {
      await t.rollback();
      res.status(500).json({ erro: 'Erro ao criar pedido', detalhes: error.message });
    }
  },

  async listar(req, res) {
    try {
      const { permissoes, id: userId } = req.user;
      let whereClause = {};

      if (permissoes.includes('MANAGE_ORDERS_COMPANY')) {
        const restaurantesDaEmpresa = await Restaurante.findAll({ 
            where: { empresaId: userId }, 
            attributes: ['id'] 
        });
        const restauranteIds = restaurantesDaEmpresa.map(r => r.id);
        whereClause.RestauranteId = restauranteIds;
      }
      else if (permissoes.includes('VIEW_ORDERS_CLIENT')) {
        whereClause.clienteId = userId;
      }
      
      const pedidos = await Pedido.findAll({ 
        where: whereClause, 
        include: includeOptions, 
        order: [['createdAt', 'DESC']] 
      });
      res.json(pedidos);

    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar pedidos', detalhes: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id, { include: includeOptions });
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
      const isOwner = req.user.permissoes.includes('VIEW_ORDERS_CLIENT') && pedido.clienteId === req.user.id;
      const isAdmin = req.user.permissoes.includes('MANAGE_SYSTEM');
      const isEmpresaDoPedido = req.user.permissoes.includes('MANAGE_ORDERS_COMPANY') && pedido.restaurantePedido.empresaId === req.user.id;
      if (!isOwner && !isAdmin && !isEmpresaDoPedido) {
        return res.status(403).json({ erro: 'Acesso negado a este pedido' });
      }
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar pedido', detalhes: error.message });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id, { include: [{ model: Restaurante, as: 'restaurantePedido' }] });
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
      if (req.user.permissoes && !req.user.permissoes.includes('MANAGE_SYSTEM') && pedido.restaurantePedido.empresaId !== req.user.id) {
          return res.status(403).json({ erro: 'Acesso negado.'});
      }
      const novoStatus = req.body.status;
      pedido.status = novoStatus;
      const now = new Date();
      switch(novoStatus) {
        case 'em preparo': pedido.dataConfirmacao = now; break;
        case 'entregue': pedido.dataEntrega = now; break;
        case 'cancelado': pedido.dataCancelamento = now; break;
      }
      await pedido.save();
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar pedido', detalhes: error.message });
    }
  },

  async remover(req, res) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);
      if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
      if (req.user.id !== pedido.clienteId) {
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