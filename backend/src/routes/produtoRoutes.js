const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const autenticar = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/authorizeRole');

/**
 * @swagger
 * /produtos:
 * get:
 * summary: Lista todos os produtos com filtros opcionais
 * tags: [Produtos]
 * parameters:
 * - in: query
 * name: RestauranteId
 * schema:
 * type: integer
 * description: ID do Restaurante para filtrar produtos
 * - in: query
 * name: categoria
 * schema:
 * type: string
 * description: Categoria para filtrar produtos (busca parcial)
 * - in: query
 * name: search
 * schema:
 * type: string
 * description: Termo para buscar no nome do produto
 * - in: query
 * name: ativoOnly
 * schema:
 * type: boolean
 * enum: [true, false]
 * default: true
 * description: Listar apenas produtos ativos (default true)
 * responses:
 * 200:
 * description: Lista de produtos
 * post:
 * summary: Cria um novo produto (apenas empresa dona do restaurante)
 * tags: [Produtos]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - nome
 * - preco
 * - RestauranteId
 * - categoria
 * properties:
 * nome:
 * type: string
 * descricao:
 * type: string
 * imagem:
 * type: string
 * nullable: true
 * preco:
 * type: number
 * format: float
 * categoria:
 * type: string
 * RestauranteId:
 * type: integer
 * ativo:
 * type: boolean
 * default: true
 * responses:
 * 201:
 * description: Produto criado com sucesso
 * 400:
 * description: Dados inválidos
 * 403:
 * description: Acesso negado (não é dono do restaurante)
 * 404:
 * description: Restaurante não encontrado
 */
router.get('/', controller.listar); 
router.post('/', autenticar, authorizeRole('empresa'), controller.criar);

/**
 * @swagger
 * /produtos/{id}:
 * get:
 * summary: Busca um produto por ID
 * tags: [Produtos]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Produto encontrado
 * 404:
 * description: Produto não encontrado
 * put:
 * summary: Atualiza um produto (apenas empresa dona do restaurante)
 * tags: [Produtos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * nome:
 * type: string
 * descricao:
 * type: string
 * nullable: true
 * imagem:
 * type: string
 * nullable: true
 * preco:
 * type: number
 * format: float
 * categoria:
 * type: string
 * ativo:
 * type: boolean
 * responses:
 * 200:
 * description: Produto atualizado com sucesso
 * 403:
 * description: Acesso negado (não é dono do restaurante)
 * 404:
 * description: Produto não encontrado
 * delete:
 * summary: Remove um produto (apenas empresa dona do restaurante)
 * tags: [Produtos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Produto removido
 * 403:
 * description: Acesso negado (não é dono do restaurante)
 * 404:
 * description: Produto não encontrado
 */
router.get('/:id', controller.buscarPorId);
router.put('/:id', autenticar, authorizeRole('empresa'), controller.atualizar);
router.delete('/:id', autenticar, authorizeRole('empresa'), controller.remover);

module.exports = router;