const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.post('/login', controller.login);
router.post('/register', controller.criar);

router.use(autenticar);

router.get('/', authorizePermission('MANAGE_SYSTEM'), controller.listar);

router.get('/:id', controller.buscarPorId);
router.put('/:id', controller.atualizar);
router.delete('/:id', authorizePermission('MANAGE_SYSTEM'), controller.remover);
router.put('/:id/grupo', authorizePermission('MANAGE_SYSTEM'), controller.atualizarGrupo);

module.exports = router;