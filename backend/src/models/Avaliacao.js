const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./Pedido');

const Avaliacao = sequelize.define('Avaliacao', {
  nota: DataTypes.INTEGER,
  comentario: DataTypes.STRING
});

Avaliacao.belongsTo(Pedido);

module.exports = Avaliacao;
