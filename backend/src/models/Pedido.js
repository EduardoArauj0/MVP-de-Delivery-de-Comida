const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  status: { type: DataTypes.STRING, defaultValue: 'pendente' }
});

module.exports = Pedido;