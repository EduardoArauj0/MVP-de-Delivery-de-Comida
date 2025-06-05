const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Cozinha = require('./Cozinha');

const Restaurante = sequelize.define('Restaurante', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: DataTypes.STRING,
  endereco: DataTypes.STRING,
  taxaFrete: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  aberto: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  imagemUrl: {
    type: DataTypes.STRING, 
    allowNull: true,
  }
});

Restaurante.belongsTo(User, { as: 'empresa', foreignKey: 'empresaId' });
User.hasMany(Restaurante, { foreignKey: 'empresaId' });

Restaurante.belongsTo(Cozinha, { foreignKey: 'CozinhaId' });
Cozinha.hasMany(Restaurante, { foreignKey: 'CozinhaId' });

module.exports = Restaurante;