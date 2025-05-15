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

app.get('/', (req, res) => res.send('API Delivery online 🚀'));

module.exports = app;
