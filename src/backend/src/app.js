const express = require('express');
const app = express();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const restauranteRoutes = require('./routes/restauranteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const modoPagamentoRoutes = require('./routes/modoPagamentoRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cozinhaRoutes = require('./routes/cozinhaRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const grupoRoutes = require('./routes/grupoRoutes'); 

app.use('/restaurantes', restauranteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/modospagamento', modoPagamentoRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/cozinhas', cozinhaRoutes);
app.use('/enderecos', enderecoRoutes);
app.use('/grupos', grupoRoutes);

app.get('/', (req, res) => res.send('API Delivery online 🚀'));

module.exports = app;