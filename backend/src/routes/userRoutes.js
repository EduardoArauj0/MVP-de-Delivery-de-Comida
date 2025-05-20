const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token JWT e dados do usuário
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', controller.login);

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Cadastra um novo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [cliente, admin, empresa]
 *     responses:
 *       201:
 *         description: Usuario criado com sucesso
 *       400:
 *         description: Email ja cadastrado
 */
router.post('/register', controller.criar);

// Só admin pode ver todos os usuários
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuarios (apenas admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: Acesso negado
 */
router.get('/', autenticar, authorizeRole('admin'), controller.listar);

// Qualquer usuário autenticado pode ver/atualizar/deletar a si mesmo
/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca um usuario por ID (autenticado)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuario nao encontrado
 *   put:
 *     summary: Atualiza um usuario (autenticado ou admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [cliente, admin, empresa]
 *     responses:
 *       200:
 *         description: Usuario atualizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuario nao encontrado
 *   delete:
 *     summary: Remove um usuario (autenticado ou admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario removido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuario nao encontrado
 */
router.get('/:id', autenticar, controller.buscarPorId);
router.put('/:id', autenticar, controller.atualizar);
router.delete('/:id', autenticar, controller.remover);

module.exports = router;
