const { User, Grupo, Permissao } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  // Cadastro
  async criar(req, res) {
    try {
      const { nome, email, senha } = req.body;
      const userExists = await User.findOne({ where: { email } });
      if (userExists) return res.status(400).json({ erro: 'Email já cadastrado' });

      const user = await User.create({ nome, email, senha });

      const clienteGroup = await Grupo.findOne({ where: { nome: 'Cliente' } });
      if (clienteGroup) {
        await user.addGrupo(clienteGroup);
      }

      res.status(201).json({ id: user.id, nome: user.nome, email: user.email });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: error.message });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const user = await User.findOne({
        where: { email },
        include: {
          model: Grupo,
          as: 'grupos',
          include: { model: Permissao, as: 'permissoes' },
        },
      });

      if (!user) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

      const valid = await bcrypt.compare(senha, user.senha);
      if (!valid) return res.status(401).json({ erro: 'Usuário ou senha inválidos' });

      const permissoes = user.grupos.flatMap(g => g.permissoes.map(p => p.nome));
      const uniquePermissoes = [...new Set(permissoes)];

      const payload = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        permissoes: uniquePermissoes,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, user: payload });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao fazer login' });
    }
  },

  // Listar usuários
  async listar(req, res) {
    try {
      const users = await User.findAll({ 
        attributes: ['id', 'nome', 'email'],
        include: { model: Grupo, as: 'grupos', attributes: ['nome'], through: { attributes: [] } }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },

  // Buscar por ID
  async buscarPorId(req, res) {
    try {
      const user = await User.findByPk(req.params.id, { 
        attributes: ['id', 'nome', 'email'],
        include: { model: Grupo, as: 'grupos', attributes: ['nome'], through: { attributes: [] } }
      });
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

      const canManageSystem = req.user.permissoes.includes('MANAGE_SYSTEM');
      if (req.user.id !== Number(req.params.id) && !canManageSystem) {
        return res.status(403).json({ erro: 'Você não tem permissão para modificar outro usuário' });
      }

      const { nome, email, senha } = req.body;

      if (nome) user.nome = nome;
      if (email) user.email = email;
      if (senha) user.senha = senha;

      await user.save();
      res.json({ id: user.id, nome: user.nome, email: user.email });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar usuário', detalhes: error.message });
    }
  },

  // Remover usuário
  async remover(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

      const canManageSystem = req.user.permissoes.includes('MANAGE_SYSTEM');
      if (req.user.id !== Number(req.params.id) && !canManageSystem) {
        return res.status(403).json({ erro: 'Você não tem permissão para remover outro usuário' });
      }

      await user.destroy();
      res.json({ mensagem: 'Usuário removido com sucesso' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover usuário' });
    }
  }
};