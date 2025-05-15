const express = require('express');
const router = express.Router();
const controller = require('../controllers/carrinhoController');

router.get('/:clienteId', controller.obterCarrinho);
router.post('/:clienteId/itens', controller.adicionarItem);
router.put('/:clienteId/itens/:itemId', controller.atualizarItem);
router.delete('/:clienteId/itens/:itemId', controller.removerItem);
router.delete('/:clienteId', controller.limparCarrinho);

module.exports = router;
