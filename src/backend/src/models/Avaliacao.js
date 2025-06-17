const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Avaliacao;