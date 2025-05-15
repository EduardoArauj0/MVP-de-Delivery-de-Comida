const express = require('express');
const router = express.Router();
const controller = require('../controllers/restauranteController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.post('/', autenticar, authorizeRole('empresa', 'admin'), controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('empresa', 'admin'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('admin'), controller.remover);

module.exports = router;
