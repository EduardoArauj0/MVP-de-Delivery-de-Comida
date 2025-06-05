const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Restaurante = require('./Restaurante');

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: DataTypes.STRING,
  imagem: DataTypes.STRING,
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'outros',
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

Produto.belongsTo(Restaurante, { foreignKey: 'RestauranteId' });
Restaurante.hasMany(Produto, { foreignKey: 'RestauranteId' });

module.exports = Produto;