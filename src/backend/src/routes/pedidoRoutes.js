const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.post('/', autenticar, authorizePermission('PLACE_ORDER'), controller.criar);

router.get('/', autenticar, authorizePermission('VIEW_ORDERS_CLIENT', 'MANAGE_ORDERS_COMPANY', 'MANAGE_SYSTEM'), controller.listar);
router.get('/:id', autenticar, controller.buscarPorId);

router.put('/:id/status', autenticar, authorizePermission('MANAGE_ORDERS_COMPANY'), controller.atualizarStatus);
router.delete('/:id', autenticar, authorizePermission('PLACE_ORDER'), controller.remover); // Apenas o próprio cliente pode remover

module.exports = router;