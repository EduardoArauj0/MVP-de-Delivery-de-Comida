const express = require('express');
const router = express.Router();
const controller = require('../controllers/carrinhoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.use(autenticar, authorizePermission('PLACE_ORDER'));

router.get('/:clienteId', controller.obterCarrinho);
router.delete('/:clienteId', controller.limparCarrinho);
router.post('/:clienteId/itens', controller.adicionarItem);
router.put('/:clienteId/itens/:itemId', controller.atualizarItem);
router.delete('/:clienteId/itens/:itemId', controller.removerItem);

module.exports = router;