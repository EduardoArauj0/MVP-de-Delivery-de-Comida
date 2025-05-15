const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./Pedido');
const Produto = require('./Produto');

const ItemPedido = sequelize.define('ItemPedido', {
  quantidade: DataTypes.INTEGER
});

ItemPedido.belongsTo(Pedido);
ItemPedido.belongsTo(Produto);

module.exports = ItemPedido;
