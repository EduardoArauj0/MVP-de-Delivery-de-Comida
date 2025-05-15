const { Restaurante, ModoPagamento, Produto } = require('../models');

async function seedDatabase() {
  const restaurantes = await Restaurante.findAll();
  if (restaurantes.length > 0) return console.log('Seed já foi executado.');

  // Restaurantes
  const restaurantesCriados = await Restaurante.bulkCreate([
    { nome: 'Pizzaria Bella Massa', cnpj: '12345678000199', telefone: '(11) 99999-0001', endereco: 'Rua das Pizzas, 101' },
    { nome: 'Sushi Express', cnpj: '98765432000155', telefone: '(11) 99999-0002', endereco: 'Av. Japão, 202' },
    { nome: 'Hamburgueria Top Burger', cnpj: '45678912000188', telefone: '(11) 99999-0003', endereco: 'Rua do Hambúrguer, 303' }
  ]);

  // Modos de Pagamento
  await ModoPagamento.bulkCreate([
    { nome: 'Cartão de Crédito' },
    { nome: 'Cartão de Débito' },
    { nome: 'Dinheiro' }
  ]);

  // Produtos (com restauranteId)
  const produtos = [
    { nome: 'Pizza de Calabresa', descricao: 'Deliciosa pizza com calabresa', imagem: 'https://via.placeholder.com/150', preco: 39.90, RestauranteId: restaurantesCriados[0].id },
    { nome: 'Pizza de Margherita', descricao: 'Clássica margherita', imagem: 'https://via.placeholder.com/150', preco: 35.00, RestauranteId: restaurantesCriados[0].id },
    { nome: 'Pizza de Quatro Queijos', descricao: 'Queijos variados', imagem: 'https://via.placeholder.com/150', preco: 42.00, RestauranteId: restaurantesCriados[0].id },

    { nome: 'Sushi Combo 10 peças', descricao: 'Combo de sushi fresquinho', imagem: 'https://via.placeholder.com/150', preco: 29.90, RestauranteId: restaurantesCriados[1].id },
    { nome: 'Temaki de Salmão', descricao: 'Temaki com salmão fresco', imagem: 'https://via.placeholder.com/150', preco: 24.50, RestauranteId: restaurantesCriados[1].id },
    { nome: 'Yakissoba de Frango', descricao: 'Macarrão oriental', imagem: 'https://via.placeholder.com/150', preco: 27.90, RestauranteId: restaurantesCriados[1].id },

    { nome: 'Hambúrguer Clássico', descricao: 'Carne, queijo e salada', imagem: 'https://via.placeholder.com/150', preco: 19.90, RestauranteId: restaurantesCriados[2].id },
    { nome: 'Cheeseburger', descricao: 'Com muito queijo', imagem: 'https://via.placeholder.com/150', preco: 21.90, RestauranteId: restaurantesCriados[2].id },
    { nome: 'Combo Burger + Batata', descricao: 'Combo completo', imagem: 'https://via.placeholder.com/150', preco: 29.90, RestauranteId: restaurantesCriados[2].id },
    { nome: 'Milkshake Chocolate', descricao: 'Milkshake gelado', imagem: 'https://via.placeholder.com/150', preco: 14.00, RestauranteId: restaurantesCriados[2].id },
  ];

  await Produto.bulkCreate(produtos);

  console.log('✅ Seed executado com sucesso!');
}

module.exports = seedDatabase;
