const express = require('express');
const router = express.Router();
const controller = require('../controllers/carrinhoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.get('/:clienteId', autenticar, authorizeRole('cliente'), controller.obterCarrinho);
router.post('/:clienteId/itens', autenticar, authorizeRole('cliente'), controller.adicionarItem);
router.put('/:clienteId/itens/:itemId', autenticar, authorizeRole('cliente'), controller.atualizarItem);
router.delete('/:clienteId/itens/:itemId', autenticar, authorizeRole('cliente'), controller.removerItem);
router.delete('/:clienteId', autenticar, authorizeRole('cliente'), controller.limparCarrinho);

if (req.user.id !== Number(req.params.clienteId)) {
  return res.status(403).json({ erro: 'Acesso negado ao carrinho de outro usuário' });
}

module.exports = router;
