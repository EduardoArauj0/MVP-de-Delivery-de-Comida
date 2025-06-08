const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.post('/login', controller.login);
router.post('/register', controller.criar);

router.get('/', autenticar, authorizePermission('MANAGE_SYSTEM'), controller.listar);

router.get('/:id', autenticar, controller.buscarPorId);
router.put('/:id', autenticar, controller.atualizar);
router.delete('/:id', autenticar, controller.remover);

module.exports = router;