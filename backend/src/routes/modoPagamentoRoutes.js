const express = require('express');
const router = express.Router();
const controller = require('../controllers/modoPagamentoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /modospagamento:
 *   get:
 *     summary: Lista todos os modos de pagamento
 *     tags: [ModosPagamento]
 *     responses:
 *       200:
 *         description: Lista de modos de pagamento
 *   post:
 *     summary: Cria um novo modo de pagamento
 *     tags: [ModosPagamento]
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
 *     responses:
 *       201:
 *         description: Modo de pagamento criado
 */
router.post('/', autenticar, authorizeRole('admin'), controller.criar);
router.get('/', controller.listar);

/**
 * @swagger
 * /modospagamento/{id}:
 *   get:
 *     summary: Busca modo de pagamento por ID
 *     tags: [ModosPagamento]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Modo de pagamento encontrado
 *       404:
 *         description: Modo de pagamento nao encontrado
 *   put:
 *     summary: Atualiza modo de pagamento
 *     tags: [ModosPagamento]
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
 *     responses:
 *       200:
 *         description: Modo de pagamento atualizado
 *   delete:
 *     summary: Remove modo de pagamento
 *     tags: [ModosPagamento]
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
 *         description: Modo de pagamento removido
 */
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('admin'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('admin'), controller.remover);

module.exports = router;
