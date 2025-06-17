const { Grupo } = require('../models');

module.exports = {
  async listar(req, res) {
    try {
      const grupos = await Grupo.findAll();
      res.status(200).json(grupos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar grupos', detalhes: error.message });
    }
  }
};