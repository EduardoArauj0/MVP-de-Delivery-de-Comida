const express = require('express');
const router = express.Router();
const controller = require('../controllers/enderecoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.use(autenticar, authorizeRole('cliente'));

router.post('/', controller.criar);
router.get('/meus', controller.listarPorUsuario);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;