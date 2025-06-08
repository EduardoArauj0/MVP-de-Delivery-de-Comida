const express = require('express');
const router = express.Router();
const controller = require('../controllers/enderecoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.use(autenticar, authorizePermission('PLACE_ORDER'));

router.post('/', controller.criar);
router.get('/meus', controller.listarPorUsuario);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;