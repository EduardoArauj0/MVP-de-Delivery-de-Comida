const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cozinha = sequelize.define('Cozinha', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
});

module.exports = Cozinha;