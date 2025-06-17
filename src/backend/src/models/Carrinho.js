const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carrinho = sequelize.define('Carrinho', {});

module.exports = Carrinho;