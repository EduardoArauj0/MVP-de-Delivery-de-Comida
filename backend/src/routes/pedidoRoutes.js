const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos os pedidos (cliente, empresa ou admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: integer
 *               restauranteId:
 *                 type: integer
 *               formaPagamentoId:
 *                 type: integer
 *               itens:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produtoId:
 *                       type: integer
 *                     quantidade:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post('/', autenticar, authorizeRole('cliente'), controller.criar);
router.get('/', autenticar, controller.listar);

/**
 * @swagger
 * /pedidos/{id}:
 *   get:
 *     summary: Busca um pedido por ID
 *     tags: [Pedidos]
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
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido nao encontrado
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos]
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
 *         description: Pedido removido
 *       404:
 *         description: Pedido nao encontrado
 *   put:
 *     summary: Atualiza o status de um pedido
 *     tags: [Pedidos]
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
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.get('/:id', autenticar, controller.buscarPorId);
router.put('/:id/status', autenticar, authorizeRole('empresa'), controller.atualizarStatus);
router.delete('/:id', autenticar, authorizeRole('cliente'), controller.remover);

module.exports = router;
