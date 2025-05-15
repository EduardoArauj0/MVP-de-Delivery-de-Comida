const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  nome: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  senha: DataTypes.STRING,
  tipo: { type: DataTypes.ENUM('cliente', 'admin'), defaultValue: 'cliente' }
});

module.exports = User;
