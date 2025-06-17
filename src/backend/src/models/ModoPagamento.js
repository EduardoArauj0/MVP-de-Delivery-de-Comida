const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModoPagamento = sequelize.define('ModoPagamento', {
  nome: DataTypes.STRING
});

module.exports = ModoPagamento;
