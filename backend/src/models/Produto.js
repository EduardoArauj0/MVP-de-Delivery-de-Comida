const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Restaurante = require('./Restaurante');

const Produto = sequelize.define('Produto', {
  nome: DataTypes.STRING,
  descricao: DataTypes.STRING,
  imagem: DataTypes.STRING,
  preco: DataTypes.FLOAT
});

Produto.belongsTo(Restaurante); // Produto pertence a um restaurante

module.exports = Produto;
