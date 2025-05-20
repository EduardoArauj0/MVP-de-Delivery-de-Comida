const express = require('express');
const router = express.Router();
const controller = require('../controllers/carrinhoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /carrinho/{clienteId}:
 *   get:
 *     summary: Obtem o carrinho do cliente
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clienteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrinho encontrado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Carrinho nao encontrado
 *   delete:
 *     summary: Limpa todo o carrinho do cliente
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clienteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrinho limpo
 */
router.get('/:clienteId', autenticar, authorizeRole('cliente'), controller.obterCarrinho);
router.delete('/:clienteId', autenticar, authorizeRole('cliente'), controller.limparCarrinho);

/**
 * @swagger
 * /carrinho/{clienteId}/itens:
 *   post:
 *     summary: Adiciona item ao carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clienteId
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
 *               produtoId:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item adicionado
 */
router.post('/:clienteId/itens', autenticar, authorizeRole('cliente'), controller.adicionarItem);

/**
 * @swagger
 * /carrinho/{clienteId}/itens/{itemId}:
 *   put:
 *     summary: Atualiza item do carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clienteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: itemId
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
 *               quantidade:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item atualizado
 *   delete:
 *     summary: Remove item do carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clienteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: itemId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removido
 */
router.put('/:clienteId/itens/:itemId', autenticar, authorizeRole('cliente'), controller.atualizarItem);
router.delete('/:clienteId/itens/:itemId', autenticar, authorizeRole('cliente'), controller.removerItem);

module.exports = router;
