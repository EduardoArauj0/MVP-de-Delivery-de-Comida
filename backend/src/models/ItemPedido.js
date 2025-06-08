const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ItemPedido = sequelize.define('ItemPedido', {
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precoUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  precoTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  observacao: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = ItemPedido;