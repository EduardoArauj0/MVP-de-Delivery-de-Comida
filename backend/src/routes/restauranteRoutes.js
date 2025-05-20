const express = require('express');
const router = express.Router();
const controller = require('../controllers/restauranteController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /restaurantes:
 *   get:
 *     summary: Lista todos os restaurantes
 *     tags: [Restaurantes]
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 *   post:
 *     summary: Cria um novo restaurante (empresa)
 *     tags: [Restaurantes]
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
 *               cnpj:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurante criado
 */
router.post('/', autenticar, authorizeRole('empresa', 'admin'), controller.criar);
router.get('/', controller.listar);

/**
 * @swagger
 * /restaurantes/{id}:
 *   get:
 *     summary: Busca restaurante por ID
 *     tags: [Restaurantes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurante encontrado
 *       404:
 *         description: Restaurante nao encontrado
 *   put:
 *     summary: Atualiza restaurante (empresa ou admin)
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               cnpj:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurante atualizado
 *       403:
 *         description: Acesso negado
 *   delete:
 *     summary: Remove restaurante (admin)
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurante removido
 */
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('empresa', 'admin'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('admin'), controller.remover);

module.exports = router;
