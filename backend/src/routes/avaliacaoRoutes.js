const express = require('express');
const router = express.Router();
const controller = require('../controllers/avaliacaoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /avaliacoes:
 *   get:
 *     summary: Lista todas as avaliacoes
 *     tags: [Avaliacoes]
 *     responses:
 *       200:
 *         description: Lista de avaliacoes
 *   post:
 *     summary: Cria uma nova avaliacao (cliente)
 *     tags: [Avaliacoes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: integer
 *               comentario:
 *                 type: string
 *               PedidoId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Avaliacao criada com sucesso
 *       404:
 *         description: Pedido nao encontrado
 */
router.post('/', autenticar, authorizeRole('cliente'), controller.criar);
router.get('/', controller.listar);
/**
 * @swagger
 * /avaliacoes/{id}:
 *   get:
 *     summary: Busca uma avaliacao por ID
 *     tags: [Avaliacoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Avaliacao encontrada
 *       404:
 *         description: Avaliacao nao encontrada
 *   put:
 *     summary: Atualiza uma avaliacao (cliente)
 *     tags: [Avaliacoes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: integer
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avaliacao atualizada
 *   delete:
 *     summary: Remove uma avaliacao (cliente ou admin)
 *     tags: [Avaliacoes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Avaliacao removida
 */
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('cliente'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('cliente', 'admin'), controller.remover);

module.exports = router;
