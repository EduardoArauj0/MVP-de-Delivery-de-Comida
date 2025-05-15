const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.post('/', autenticar, authorizeRole('cliente'), controller.criar);
router.get('/', autenticar, controller.listar);
router.get('/:id', autenticar, controller.buscarPorId);

router.put('/:id/status', autenticar, authorizeRole('empresa'), controller.atualizarStatus);
router.delete('/:id', autenticar, authorizeRole('cliente'), controller.remover);

module.exports = router;
