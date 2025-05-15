const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Restaurante = require('./Restaurante');
const ModoPagamento = require('./ModoPagamento');

const Pedido = sequelize.define('Pedido', {
  status: { type: DataTypes.STRING, defaultValue: 'pendente' }
});

Pedido.belongsTo(User, { as: 'cliente' });
Pedido.belongsTo(Restaurante);
Pedido.belongsTo(ModoPagamento, { as: 'formaPagamento' });

module.exports = Pedido;
