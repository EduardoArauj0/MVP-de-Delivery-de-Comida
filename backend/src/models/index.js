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
  CarrinhoItem
};
