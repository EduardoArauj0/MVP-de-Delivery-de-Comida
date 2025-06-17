const express = require('express');
const router = express.Router();
const controller = require('../controllers/grupoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizePermission = require('../middlewares/authorizePermission');

router.get('/', autenticar, authorizePermission('MANAGE_SYSTEM'), controller.listar);

module.exports = router;