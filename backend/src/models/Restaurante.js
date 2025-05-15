const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Restaurante = sequelize.define('Restaurante', {
  nome: DataTypes.STRING,
  cnpj: DataTypes.STRING,
  telefone: DataTypes.STRING,
  endereco: DataTypes.STRING
});

Restaurante.belongsTo(User, { as: 'empresa' });
module.exports = Restaurante;
