const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoController');

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id/status', controller.atualizarStatus);
router.delete('/:id', controller.remover);

module.exports = router;
