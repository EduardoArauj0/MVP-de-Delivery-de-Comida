const sequelize = require('../config/database');

const User = require('./User');
const Restaurante = require('./Restaurante');
const Produto = require('./Produto');
const Pedido = require('./Pedido');
const ItemPedido = require('./ItemPedido');
const ModoPagamento = require('./ModoPagamento');
const Avaliacao = require('./Avaliacao');
const Carrinho = require('./Carrinho');
const CarrinhoItem = require('./CarrinhoItem');
const Cozinha = require('./Cozinha');
const Endereco = require('./Endereco');
const Grupo = require('./Grupo');
const Permissao = require('./Permissao');

// Restaurante - Empresa (User)
User.hasMany(Restaurante, { foreignKey: 'empresaId' });
Restaurante.belongsTo(User, { as: 'usuarioEmpresa', foreignKey: 'empresaId' });

// Restaurante - Cozinha
Restaurante.belongsTo(Cozinha, { as: 'tipoCozinha', foreignKey: 'CozinhaId' });
Cozinha.hasMany(Restaurante, { as: 'restaurantesCadastrados', foreignKey: 'CozinhaId' });

// Restaurante - Produto
Produto.belongsTo(Restaurante, { as: 'restauranteProduto', foreignKey: 'RestauranteId' });
Restaurante.hasMany(Produto, { as: 'produtosOferecidos', foreignKey: 'RestauranteId' });

// Restaurante - Avaliacao
Restaurante.hasMany(Avaliacao, { foreignKey: 'RestauranteId' });
Avaliacao.belongsTo(Restaurante, { foreignKey: 'RestauranteId' });

// Pedido - Cliente (User)
Pedido.belongsTo(User, { as: 'usuarioCliente', foreignKey: 'clienteId' });
User.hasMany(Pedido, { as: 'pedidosDoCliente', foreignKey: 'clienteId' });

// Pedido - Restaurante
Pedido.belongsTo(Restaurante, { as: 'restaurantePedido', foreignKey: 'RestauranteId' });
Restaurante.hasMany(Pedido, { as: 'pedidosRecebidos', foreignKey: 'RestauranteId' });

// Pedido - Modo de Pagamento
Pedido.belongsTo(ModoPagamento, { as: 'metodoPagamento', foreignKey: 'formaPagamentoId' });
ModoPagamento.hasMany(Pedido, { as: 'pedidosComPagamento', foreignKey: 'formaPagamentoId' });

// Pedido - Itens
ItemPedido.belongsTo(Pedido, { as: 'pedidoRelacionado', foreignKey: 'PedidoId' });
Pedido.hasMany(ItemPedido, { as: 'itensDoPedido', foreignKey: 'PedidoId' });

// Produto - Itens de Pedido
ItemPedido.belongsTo(Produto, { as: 'produtoItem', foreignKey: 'ProdutoId' });
Produto.hasMany(ItemPedido, { as: 'itensRelacionados', foreignKey: 'ProdutoId' });

// Avaliação - Pedido
Avaliacao.belongsTo(Pedido, { as: 'pedidoAvaliado', foreignKey: 'PedidoId' });
Pedido.hasOne(Avaliacao, { as: 'avaliacaoFeita', foreignKey: 'PedidoId' });

// Avaliação - Cliente (User)
Avaliacao.belongsTo(User, { as: 'avaliador', foreignKey: 'clienteId' });
User.hasMany(Avaliacao, { as: 'avaliacoesFeitas', foreignKey: 'clienteId' });

// Carrinho - Cliente (User)
Carrinho.belongsTo(User, { as: 'usuarioCarrinho', foreignKey: 'clienteId' });
User.hasOne(Carrinho, { as: 'carrinhoDoCliente', foreignKey: 'clienteId' });

// Carrinho - Itens
CarrinhoItem.belongsTo(Carrinho, { as: 'carrinhoRelacionado', foreignKey: 'CarrinhoId' });
Carrinho.hasMany(CarrinhoItem, { as: 'itensNoCarrinho', foreignKey: 'CarrinhoId' });

// Produto - Itens de Carrinho
CarrinhoItem.belongsTo(Produto, { as: 'produtoCarrinho', foreignKey: 'ProdutoId' });
Produto.hasMany(CarrinhoItem, { as: 'carrinhosComProduto', foreignKey: 'ProdutoId' });

// User - Endereco
User.hasMany(Endereco, { as: 'enderecos', foreignKey: 'UserId' });
Endereco.belongsTo(User, { foreignKey: 'UserId' });

// User <-> Grupo (Many-to-Many)
User.belongsToMany(Grupo, { through: 'UsuarioGrupo', as: 'grupos' });
Grupo.belongsToMany(User, { through: 'UsuarioGrupo', as: 'usuarios' });

// Grupo <-> Permissao (Many-to-Many)
Grupo.belongsToMany(Permissao, { through: 'GrupoPermissao', as: 'permissoes' });
Permissao.belongsToMany(Grupo, { through: 'GrupoPermissao', as: 'grupos' });

module.exports = {
  sequelize,
  User,
  Restaurante,
  Produto,
  Pedido,
  ItemPedido,
  ModoPagamento,
  Avaliacao,
  Carrinho,
  CarrinhoItem,
  Cozinha,
  Endereco,
  Grupo,
  Permissao,
};