const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/register', controller.criar);
router.post('/login', controller.login);

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;
