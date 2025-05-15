const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Carrinho = require('./Carrinho');
const Produto = require('./Produto');

const CarrinhoItem = sequelize.define('CarrinhoItem', {
  quantidade: DataTypes.INTEGER
});

CarrinhoItem.belongsTo(Carrinho);
CarrinhoItem.belongsTo(Produto);

module.exports = CarrinhoItem;
