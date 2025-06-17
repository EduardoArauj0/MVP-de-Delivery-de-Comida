const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pedido = sequelize.define('Pedido', {
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'pendente' 
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  taxaFrete: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  enderecoEntrega: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  observacao: {
    type: DataTypes.STRING,      
    allowNull: true,
  },
  dataConfirmacao: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dataEntrega: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dataCancelamento: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

module.exports = Pedido;