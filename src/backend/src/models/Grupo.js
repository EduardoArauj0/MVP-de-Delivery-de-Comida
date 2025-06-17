const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grupo = sequelize.define('Grupo', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Grupo;