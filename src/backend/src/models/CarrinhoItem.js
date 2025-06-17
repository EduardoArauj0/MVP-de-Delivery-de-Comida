const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CarrinhoItem = sequelize.define('CarrinhoItem', {
  quantidade: DataTypes.INTEGER
});

module.exports = CarrinhoItem;