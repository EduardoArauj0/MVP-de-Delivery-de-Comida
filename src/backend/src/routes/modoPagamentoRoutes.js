const express = require('express');
const router = express.Router();
const controller = require('../controllers/modoPagamentoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.get('/', controller.listar);

router.post('/', autenticar, authorizePermission('MANAGE_SYSTEM'), controller.criar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizePermission('MANAGE_SYSTEM'), controller.atualizar);
router.delete('/:id', autenticar, authorizePermission('MANAGE_SYSTEM'), controller.remover);

module.exports = router;