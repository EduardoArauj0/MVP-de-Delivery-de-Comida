const express = require('express');
const router = express.Router();
const controller = require('../controllers/cozinhaController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /cozinhas:
 *   get:
 *     summary: Lista todos os tipos de cozinha
 *     tags: [Cozinhas]
 *     responses:
 *       200:
 *         description: Lista de cozinhas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cozinha'
 *
 *   post:
 *     summary: Cria um novo tipo de cozinha (apenas admin)
 *     tags: [Cozinhas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Pizzaria
 *     responses:
 *       201:
 *         description: Cozinha criada com sucesso
 *       400:
 *         description: Dados inválidos ou nome duplicado
 *       403:
 *         description: Acesso negado
 */
router.get('/', controller.listar);
router.post('/', autenticar, authorizeRole('admin'), controller.criar);

/**
 * @swagger
 * /cozinhas/{id}:
 *   get:
 *     summary: Busca um tipo de cozinha por ID (apenas admin)
 *     tags: [Cozinhas]
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
 *         description: Cozinha encontrada
 *       404:
 *         description: Cozinha não encontrada
 *       403:
 *         description: Acesso negado
 *
 *   put:
 *     summary: Atualiza um tipo de cozinha (apenas admin)
 *     tags: [Cozinhas]
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
 *     responses:
 *       200:
 *         description: Cozinha atualizada com sucesso
 *       400:
 *         description: Nome duplicado
 *       404:
 *         description: Cozinha não encontrada
 *       403:
 *         description: Acesso negado
 *
 *   delete:
 *     summary: Remove um tipo de cozinha (apenas admin)
 *     tags: [Cozinhas]
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
 *         description: Cozinha removida com sucesso
 *       404:
 *         description: Cozinha não encontrada
 *       403:
 *         description: Acesso negado
 */
router.get('/:id', autenticar, authorizeRole('admin'), controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('admin'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('admin'), controller.remover);

module.exports = router;