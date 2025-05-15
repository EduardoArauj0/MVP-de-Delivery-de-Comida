const express = require('express');
const app = express();

app.use(express.json());

const restauranteRoutes = require('./routes/restauranteRoutes');
app.use('/restaurantes', restauranteRoutes);

const produtoRoutes = require('./routes/produtoRoutes');
app.use('/produtos', produtoRoutes);

const pedidoRoutes = require('./routes/pedidoRoutes');
app.use('/pedidos', pedidoRoutes);

const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
app.use('/avaliacoes', avaliacaoRoutes);

const carrinhoRoutes = require('./routes/carrinhoRoutes');
app.use('/carrinho', carrinhoRoutes);

const modoPagamentoRoutes = require('./routes/modoPagamentoRoutes');
app.use('/modos-pagamento', modoPagamentoRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('API Delivery online 🚀'));

module.exports = app;
