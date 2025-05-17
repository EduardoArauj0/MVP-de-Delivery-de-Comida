const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  nome: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  senha: DataTypes.STRING,
  tipo: { type: DataTypes.ENUM('cliente', 'empresa', 'admin'), defaultValue: 'cliente' }
});

// Hash da senha antes de salvar
User.beforeCreate(async (user, options) => {
  const hash = await bcrypt.hash(user.senha, 10);
  user.senha = hash;
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('senha')) {
    const hash = await bcrypt.hash(user.senha, 10);
    user.senha = hash;
  }
});

module.exports = User;
