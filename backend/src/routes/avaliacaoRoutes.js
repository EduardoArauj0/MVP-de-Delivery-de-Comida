const express = require('express');
const router = express.Router();
const controller = require('../controllers/avaliacaoController');

router.post('/', controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;
