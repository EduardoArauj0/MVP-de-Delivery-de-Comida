const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

module.exports = Restaurante;