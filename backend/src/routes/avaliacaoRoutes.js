const express = require('express');
const router = express.Router();
const controller = require('../controllers/avaliacaoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.get('/restaurante/:restauranteId', controller.listarPorRestaurante);

router.post('/', autenticar, authorizePermission('PLACE_ORDER'), controller.criar);
router.get('/', autenticar, authorizePermission('MANAGE_SYSTEM'), controller.listar);

router.get('/:id', autenticar, controller.buscarPorId);
router.put('/:id', autenticar, authorizePermission('PLACE_ORDER'), controller.atualizar);
router.delete('/:id', autenticar, authorizePermission('PLACE_ORDER', 'MANAGE_SYSTEM'), controller.remover);

module.exports = router;