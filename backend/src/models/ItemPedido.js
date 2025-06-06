const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemPedido = sequelize.define('ItemPedido', {
  quantidade: DataTypes.INTEGER
});

module.exports = ItemPedido;