const express = require('express');
const router = express.Router();
const controller = require('../controllers/avaliacaoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /avaliacoes:
 *   get:
 *     summary: Lista todas as avaliacoes (geralmente para admin ou debug)
 *     tags: [Avaliacoes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliacoes
 *
 *   post:
 *     summary: Cria uma nova avaliacao (apenas cliente autenticado)
 *     tags: [Avaliacoes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nota
 *               - PedidoId
 *             properties:
 *               nota:
 *                 type: integer
 *                 description: Nota de 1 a 5
 *                 example: 5
 *               comentario:
 *                 type: string
 *                 nullable: true
 *                 example: "Muito bom!"
 *               PedidoId:
 *                 type: integer
 *                 description: ID do Pedido que está sendo avaliado
 *     responses:
 *       201:
 *         description: Avaliacao criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Pedido nao encontrado
 */
router.post('/', autenticar, authorizeRole('cliente'), controller.criar); 
router.get('/', autenticar, authorizeRole('admin'), controller.listar); 

/**
 * @swagger
 * /avaliacoes/restaurante/{restauranteId}:
 *   get:
 *     summary: Lista todas as avaliacoes de um restaurante específico
 *     tags: [Avaliacoes]
 *     parameters:
 *       - in: path
 *         name: restauranteId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do Restaurante
 *     responses:
 *       200:
 *         description: Lista de avaliacoes para o restaurante
 *       404:
 *         description: Restaurante não encontrado
 */
router.get('/restaurante/:restauranteId', controller.listarPorRestaurante);

/**
 * @swagger
 * /avaliacoes/{id}:
 *   get:
 *     summary: Busca uma avaliacao por ID
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
 *         description: Avaliacao encontrada
 *       404:
 *         description: Avaliacao nao encontrada
 *
 *   put:
 *     summary: Atualiza uma avaliacao (apenas cliente que criou)
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
 *                 description: Nota de 1 a 5
 *               comentario:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Avaliacao atualizada
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Avaliacao não encontrada
 *
 *   delete:
 *     summary: Remove uma avaliacao (cliente que criou ou admin)
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
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Avaliacao não encontrada
 */
router.get('/:id', autenticar, controller.buscarPorId); 
router.put('/:id', autenticar, authorizeRole('cliente'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('cliente', 'admin'), controller.remover);

module.exports = router;