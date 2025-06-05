const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pedido = require('./Pedido');
const User = require('./User');
const Restaurante = require('./Restaurante');

const Avaliacao = sequelize.define('Avaliacao', {
  nota: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comentario: DataTypes.STRING,
  clienteId: DataTypes.INTEGER, 
  RestauranteId: DataTypes.INTEGER,
});

Avaliacao.belongsTo(Pedido, { foreignKey: 'PedidoId' });
Pedido.hasOne(Avaliacao, { foreignKey: 'PedidoId' });

Avaliacao.belongsTo(User, { as: 'avaliador', foreignKey: 'clienteId' });
User.hasMany(Avaliacao, { foreignKey: 'clienteId' });

module.exports = Avaliacao;