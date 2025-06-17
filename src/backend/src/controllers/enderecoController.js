const { Endereco } = require('../models');

module.exports = {
  async criar(req, res) {
    try {
      const { logradouro, numero, bairro, cidade, cep, complemento } = req.body;
      const endereco = await Endereco.create({
        logradouro,
        numero,
        bairro,
        cidade,
        cep,
        complemento,
        UserId: req.user.id,
      });
      res.status(201).json(endereco);
    } catch (error) {
      res.status(400).json({ erro: 'Erro ao criar endereço.', detalhes: error.message });
    }
  },

  async listarPorUsuario(req, res) {
    try {
      const enderecos = await Endereco.findAll({ where: { UserId: req.user.id } });
      res.json(enderecos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar endereços.' });
    }
  },

  async atualizar(req, res) {
    try {
      const endereco = await Endereco.findByPk(req.params.id);
      if (!endereco) {
        return res.status(404).json({ erro: 'Endereço não encontrado.' });
      }
      if (endereco.UserId !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado.' });
      }
      await endereco.update(req.body);
      res.json(endereco);
    } catch (error) {
      res.status(400).json({ erro: 'Erro ao atualizar endereço.', detalhes: error.message });
    }
  },

  async remover(req, res) {
    try {
      const endereco = await Endereco.findByPk(req.params.id);
      if (!endereco) {
        return res.status(404).json({ erro: 'Endereço não encontrado.' });
      }
      if (endereco.UserId !== req.user.id) {
        return res.status(403).json({ erro: 'Acesso negado.' });
      }
      await endereco.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover endereço.' });
    }
  },
};