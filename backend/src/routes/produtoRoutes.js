const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.post('/', autenticar, authorizeRole('empresa'), controller.criar);
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('empresa'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('empresa'), controller.remover);

module.exports = router;
