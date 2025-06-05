const { Restaurante, ModoPagamento, Produto, User, Cozinha } = require('../models');

async function seedDatabase() {
  try {
    const cozinhasExistentes = await Cozinha.findAll();
    if (cozinhasExistentes.length > 0) {
      console.log('Seed já foi executado anteriormente (cozinhas encontradas).');
      return;
    }

    console.log('Executando seed...');

    // 1. Criar Tipos de Cozinha
    const cozinhasCriadas = await Cozinha.bulkCreate([
      { nome: 'Pizzaria' },
      { nome: 'Japonesa' },
      { nome: 'Hamburgueria' },
      { nome: 'Brasileira' },
      { nome: 'Variada' },
    ]);
    console.log(`${cozinhasCriadas.length} cozinhas criadas.`);

    // 2. Criar Usuários do tipo empresa
    const empresas = [];
    empresas.push(await User.create({
      nome: 'Dono Pizzaria da Praça',
      email: 'dono.pizza@example.com',
      senha: '123456',
      tipo: 'empresa'
    }));
    empresas.push(await User.create({
      nome: 'Chef Sushi Master',
      email: 'chef.sushi@example.com',
      senha: '123456',
      tipo: 'empresa'
    }));
    empresas.push(await User.create({
      nome: 'Gerente Burger Place',
      email: 'gerente.burger@example.com',
      senha: '123456',
      tipo: 'empresa'
    }));
    console.log(`${empresas.length} usuários empresa criados.`);

    // 3. Criar Restaurantes
    const restaurantesCriados = await Restaurante.bulkCreate([
      {
        nome: 'Pizzaria da Praça Delícias',
        cnpj: '11.222.333/0001-44',
        telefone: '(71) 99911-0001',
        endereco: 'Praça da Matriz, 10, Candeias',
        empresaId: empresas[0].id,
        CozinhaId: cozinhasCriadas.find(c => c.nome === 'Pizzaria').id,
        taxaFrete: 5.99,
        ativo: true,
        aberto: true,
        imagemUrl: 'https://source.unsplash.com/800x600/?pizza-restaurant'
      },
      {
        nome: 'Sushi Master Rolls & Cia',
        cnpj: '22.333.444/0001-55',
        telefone: '(71) 99922-0002',
        endereco: 'Av. Principal, 200, Centro',
        empresaId: empresas[1].id,
        CozinhaId: cozinhasCriadas.find(c => c.nome === 'Japonesa').id,
        taxaFrete: 0.00,
        ativo: true,
        aberto: true,
        imagemUrl: 'https://source.unsplash.com/800x600/?sushi-restaurant'
      },
      {
        nome: 'Burger Place Gourmet',
        cnpj: '33.444.555/0001-66',
        telefone: '(71) 99933-0003',
        endereco: 'Rua das Palmeiras, 303, Bairro Novo',
        empresaId: empresas[2].id,
        CozinhaId: cozinhasCriadas.find(c => c.nome === 'Hamburgueria').id,
        taxaFrete: 7.50,
        ativo: true,
        aberto: false,
        imagemUrl: 'https://source.unsplash.com/800x600/?burger-joint'
      }
    ]);
    console.log(`${restaurantesCriados.length} restaurantes criados.`);

    // 4. Criar Modos de Pagamento
    const modosPagamentoCriados = await ModoPagamento.bulkCreate([
      { nome: 'Cartão de Crédito (Online)' },
      { nome: 'Cartão de Débito (Online)' },
      { nome: 'PIX' },
      { nome: 'Dinheiro (na entrega)' },
    ]);
    console.log(`${modosPagamentoCriados.length} modos de pagamento criados.`);

    // 5. Criar Produtos
    const produtosParaCriar = [
      // Pizzaria da Praça Delícias
      { nome: 'Pizza Calabresa Tradicional', categoria: 'Pizza Salgada', descricao: 'Molho de tomate, mussarela, calabresa fatiada e orégano.', imagem: 'https://source.unsplash.com/400x300/?calabresa-pizza', preco: 39.90, RestauranteId: restaurantesCriados[0].id, ativo: true },
      { nome: 'Pizza Margherita Clássica', categoria: 'Pizza Salgada', descricao: 'Molho de tomate, mussarela, tomate fresco e manjericão.', imagem: 'https://source.unsplash.com/400x300/?margherita-pizza', preco: 37.00, RestauranteId: restaurantesCriados[0].id, ativo: true },
      { nome: 'Pizza Quatro Queijos Especial', categoria: 'Pizza Salgada', descricao: 'Mussarela, provolone, parmesão e catupiry.', imagem: 'https://source.unsplash.com/400x300/?four-cheese-pizza', preco: 42.50, RestauranteId: restaurantesCriados[0].id, ativo: true },
      { nome: 'Refrigerante Lata 350ml', categoria: 'Bebida', descricao: 'Coca-Cola, Guaraná ou Fanta.', imagem: 'https://source.unsplash.com/400x300/?soda-can', preco: 6.00, RestauranteId: restaurantesCriados[0].id, ativo: true },

      // Sushi Master Rolls & Cia
      { nome: 'Combinado Master (20 peças)', categoria: 'Sushi e Sashimi', descricao: 'Seleção do chef com sashimis, niguiris e uramakis.', imagem: 'https://source.unsplash.com/400x300/?sushi-platter', preco: 59.90, RestauranteId: restaurantesCriados[1].id, ativo: true },
      { nome: 'Temaki Salmão Completo', categoria: 'Temaki', descricao: 'Salmão fresco, cream cheese e cebolinha.', imagem: 'https://source.unsplash.com/400x300/?salmon-temaki', preco: 28.00, RestauranteId: restaurantesCriados[1].id, ativo: true },
      { nome: 'Yakisoba de Frutos do Mar', categoria: 'Prato Quente', descricao: 'Macarrão oriental com camarão, lula e legumes frescos.', imagem: 'https://source.unsplash.com/400x300/?seafood-yakisoba', preco: 45.00, RestauranteId: restaurantesCriados[1].id, ativo: true },

      // Burger Place Gourmet
      { nome: 'Classic Burger', categoria: 'Hambúrguer Artesanal', descricao: 'Pão brioche, burger de 180g, queijo cheddar, alface, tomate e molho especial.', imagem: 'https://source.unsplash.com/400x300/?classic-burger', preco: 32.00, RestauranteId: restaurantesCriados[2].id, ativo: true },
      { nome: 'Onion Rings Crocantes', categoria: 'Acompanhamento', descricao: 'Porção generosa de anéis de cebola empanados.', imagem: 'https://source.unsplash.com/400x300/?onion-rings', preco: 18.50, RestauranteId: restaurantesCriados[2].id, ativo: true },
      { nome: 'Milkshake de Ovomaltine', categoria: 'Sobremesa', descricao: 'Milkshake cremoso com pedaços de Ovomaltine.', imagem: 'https://source.unsplash.com/400x300/?milkshake', preco: 22.00, RestauranteId: restaurantesCriados[2].id, ativo: true },
      // Produto inativo para teste
      { nome: 'Burger Vegano (Em Breve)', categoria: 'Hambúrguer Vegetariano', descricao: 'Delicioso burger à base de plantas, aguarde!', imagem: 'https://source.unsplash.com/400x300/?vegan-burger', preco: 35.00, RestauranteId: restaurantesCriados[2].id, ativo: false },
    ];

    const produtosCriados = await Produto.bulkCreate(produtosParaCriar);
    console.log(`${produtosCriados.length} produtos criados.`);

    console.log('Seed executado com sucesso!');
  } catch (error) {
    console.error('Erro ao executar o seed:', error);
  }
}

module.exports = seedDatabase;