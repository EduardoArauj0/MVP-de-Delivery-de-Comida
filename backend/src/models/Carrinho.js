const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Carrinho = sequelize.define('Carrinho', {});

Carrinho.belongsTo(User, { as: 'cliente' });

module.exports = Carrinho;
