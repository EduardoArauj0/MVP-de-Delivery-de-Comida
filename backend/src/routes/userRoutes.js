const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

router.post('/register', controller.criar);
router.post('/login', controller.login);

// Só admin pode ver todos os usuários
router.get('/', autenticar, authorizeRole('admin'), controller.listar);

// Qualquer usuário autenticado pode ver/atualizar/deletar a si mesmo
router.get('/:id', autenticar, controller.buscarPorId);
router.put('/:id', autenticar, controller.atualizar);
router.delete('/:id', autenticar, controller.remover);

module.exports = router;
