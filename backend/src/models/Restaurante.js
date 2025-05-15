const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurante = sequelize.define('Restaurante', {
  nome: DataTypes.STRING,
  cnpj: DataTypes.STRING,
  telefone: DataTypes.STRING,
  endereco: DataTypes.STRING
});

module.exports = Restaurante;
