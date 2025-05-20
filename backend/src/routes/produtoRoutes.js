const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *   post:
 *     summary: Cria um novo produto (empresa)
 *     tags: [Produtos]
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
 *               descricao:
 *                 type: string
 *               imagem:
 *                 type: string
 *               preco:
 *                 type: number
 *               categoria:
 *                 type: string
 *               RestauranteId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       404:
 *         description: Restaurante nao encontrado
 */
router.get('/', controller.listar);
router.post('/', autenticar, authorizeRole('empresa'), controller.criar);

/**
 * @swagger
 * /produtos/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto nao encontrado
 *   put:
 *     summary: Atualiza um produto (empresa)
 *     tags: [Produtos]
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
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto nao encontrado
 *   delete:
 *     summary: Remove um produto (empresa)
 *     tags: [Produtos]
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
 *         description: Produto removido
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Produto nao encontrado
 */
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('empresa'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('empresa'), controller.remover);

module.exports = router;
