const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  // Cadastro
  async criar(req, res) {
    try {
      const { nome, email, senha, tipo } = req.body;
      const userExists = await User.findOne({ where: { email } });
      if (userExists) return res.status(400).json({ erro: 'Email já cadastrado' });

      const tipoPermitido = tipo === 'admin' ? 'cliente' : tipo;

      const user = await User.create({ nome, email, senha, tipo: tipoPermitido });
      res.status(201).json({ id: user.id, nome: user.nome, email: user.email, tipo: user.tipo });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: error.message });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

      const valid = await bcrypt.compare(senha, user.senha);
      if (!valid) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

      const token = jwt.sign({ id: user.id, tipo: user.tipo }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo } });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao fazer login' });
    }
  },

  // Listar usuários
  async listar(req, res) {
    try {
      const users = await User.findAll({ attributes: ['id', 'nome', 'email', 'tipo'] });
      res.json(users);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },

  // Buscar por ID
  async buscarPorId(req, res) {
    try {
      const user = await User.findByPk(req.params.id, { attributes: ['id', 'nome', 'email', 'tipo'] });
      if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
  },

  // Atualizar usuário
  async atualizar(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ erro: 'Usuário não encontrado.' });

      if (req.user.id !== Number(req.params.id) && req.user.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Você não tem permissão para modificar outro usuário' });
      }

     
      const { nome, email, senha, tipo } = req.body;

      if (nome) user.nome = nome;
      if (email) user.email = email;
      if (senha) user.senha = senha;
      
      if (tipo && req.user.tipo === 'admin') {
        user.tipo = tipo;
      }

      await user.save();
      res.json({ id: user.id, nome: user.nome, email: user.email, tipo: user.tipo });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: error.message });
    }
  },

  // Remover usuário
  async remover(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

      if (req.user.id !== Number(req.params.id) && req.user.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Você não tem permissão para remover outro usuário' });
      }
      
      await user.destroy();
      res.json({ mensagem: 'Usuário removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover usuário' });
    }
  }
};