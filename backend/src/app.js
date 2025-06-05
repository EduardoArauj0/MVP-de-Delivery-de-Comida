const express = require('express');
const app = express();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const restauranteRoutes = require('./routes/restauranteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');
const modoPagamentoRoutes = require('./routes/modoPagamentoRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cozinhaRoutes = require('./routes/cozinhaRoutes');

app.use('/restaurantes', restauranteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/avaliacoes', avaliacaoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/modospagamento', modoPagamentoRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/cozinhas', cozinhaRoutes);

// Swagger Docs
const swaggerSpec = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.send('API Delivery online 🚀'));

module.exports = app;