const express = require('express');
const router = express.Router();
const controller = require('../controllers/restauranteController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /restaurantes:
 *   get:
 *     summary: Lista todos os restaurantes com filtros opcionais
 *     tags: [Restaurantes]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termo para buscar no nome do restaurante
 *       - in: query
 *         name: cozinhaId
 *         schema:
 *           type: integer
 *         description: ID do tipo de cozinha para filtrar
 *       - in: query
 *         name: aberto
 *         schema:
 *           type: boolean
 *           enum: [true, false]
 *         description: Filtrar por restaurantes abertos/fechados
 *       - in: query
 *         name: entregaGratis
 *         schema:
 *           type: boolean
 *           enum: [true]
 *         description: Filtrar por restaurantes com entrega grátis (taxaFrete = 0)
 *       - in: query
 *         name: ativoOnly
 *         schema:
 *           type: boolean
 *           enum: [true, false]
 *           default: true
 *         description: Listar apenas restaurantes ativos (default true)
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [nome, taxaFrete]
 *         description: Campo para ordenação
 *       - in: query
 *         name: orderDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *         description: Direção da ordenação (ASC ou DESC)
 *     responses:
 *       200:
 *         description: Lista de restaurantes
 * 
 *   post:
 *     summary: Cria um novo restaurante (empresa ou admin)
 *     tags: [Restaurantes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - CozinhaId
 *             properties:
 *               nome:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *               taxaFrete:
 *                 type: number
 *                 format: float
 *                 default: 0.00
 *               ativo:
 *                 type: boolean
 *                 default: true
 *               aberto:
 *                 type: boolean
 *                 default: true
 *               imagemUrl:
 *                 type: string
 *                 nullable: true
 *               CozinhaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Restaurante criado
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Cozinha não encontrada
 */
router.post('/', autenticar, authorizeRole('empresa', 'admin'), controller.criar);
router.get('/', controller.listar);

/**
 * @swagger
 * /restaurantes/{id}:
 *   get:
 *     summary: Busca restaurante por ID (inclui produtos ativos e tipo de cozinha)
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
 *         description: Restaurante não encontrado
 *   put:
 *     summary: Atualiza restaurante (empresa dona ou admin)
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
 *               taxaFrete:
 *                 type: number
 *                 format: float
 *               ativo:
 *                 type: boolean
 *               aberto:
 *                 type: boolean
 *               imagemUrl:
 *                 type: string
 *                 nullable: true
 *               CozinhaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Restaurante atualizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Restaurante ou Cozinha não encontrada
 *   delete:
 *     summary: Remove restaurante (apenas admin)
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
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Restaurante não encontrado
 */
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('empresa', 'admin'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('admin'), controller.remover);

module.exports = router;