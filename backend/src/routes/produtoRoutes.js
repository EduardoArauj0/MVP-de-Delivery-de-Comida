const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);

router.post('/', autenticar, authorizePermission('MANAGE_PRODUCTS'), controller.criar);
router.put('/:id', autenticar, authorizePermission('MANAGE_PRODUCTS'), controller.atualizar);
router.delete('/:id', autenticar, authorizePermission('MANAGE_PRODUCTS'), controller.remover);

module.exports = router;