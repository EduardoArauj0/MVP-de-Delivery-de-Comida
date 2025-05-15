const express = require('express');
const router = express.Router();
const controller = require('../controllers/avaliacaoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.post('/', autenticar, authorizeRole('cliente'), controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('cliente'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('cliente', 'admin'), controller.remover);

module.exports = router;
