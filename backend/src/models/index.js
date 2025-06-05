const sequelize = require('../config/database');

const User = require('./User');
const Restaurante = require('./Restaurante');
const Produto = require('./Produto');
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');
const ModoPagamento = require('./ModoPagamento');
const Avaliacao = require('./Avaliacao');
const Carrinho = require('./Carrinho');
const CarrinhoItem = require('./CarrinhoItem');
const Cozinha = require('./Cozinha');

User.hasMany(Restaurante, { foreignKey: 'empresaId' });
Restaurante.belongsTo(User, { as: 'empresa', foreignKey: 'empresaId' });

Restaurante.belongsTo(Cozinha, { foreignKey: 'CozinhaId' });
Cozinha.hasMany(Restaurante, { foreignKey: 'CozinhaId' });

Produto.belongsTo(Restaurante, { foreignKey: 'RestauranteId' });
Restaurante.hasMany(Produto, { foreignKey: 'RestauranteId' });

Pedido.belongsTo(User, { as: 'cliente', foreignKey: 'clienteId' });
User.hasMany(Pedido, { as: 'pedidosCliente', foreignKey: 'clienteId'});

Pedido.belongsTo(Restaurante, { foreignKey: 'RestauranteId' });
Restaurante.hasMany(Pedido, { foreignKey: 'RestauranteId' });

Pedido.belongsTo(ModoPagamento, { as: 'formaPagamento', foreignKey: 'formaPagamentoId' });
ModoPagamento.hasMany(Pedido, { foreignKey: 'formaPagamentoId' });

ItemPedido.belongsTo(Pedido, { foreignKey: 'PedidoId' });
Pedido.hasMany(ItemPedido, { foreignKey: 'PedidoId' });

ItemPedido.belongsTo(Produto, { foreignKey: 'ProdutoId' });
Produto.hasMany(ItemPedido, { foreignKey: 'ProdutoId' });

Avaliacao.belongsTo(Pedido, { foreignKey: 'PedidoId' });
Pedido.hasOne(Avaliacao, { foreignKey: 'PedidoId' });

Carrinho.belongsTo(User, { as: 'cliente', foreignKey: 'clienteId' });
User.hasOne(Carrinho, { foreignKey: 'clienteId'});

CarrinhoItem.belongsTo(Carrinho, { foreignKey: 'CarrinhoId' });
Carrinho.hasMany(CarrinhoItem, { foreignKey: 'CarrinhoId' });

CarrinhoItem.belongsTo(Produto, { foreignKey: 'ProdutoId' });
Produto.hasMany(CarrinhoItem, { foreignKey: 'ProdutoId' });


module.exports = {
  sequelize,
  User,
  Restaurante,
  Produto,
  Pedido,
  ItemPedido,
  ModoPagamento,
  Avaliacao,
  Carrinho,
  CarrinhoItem,
  Cozinha,
};