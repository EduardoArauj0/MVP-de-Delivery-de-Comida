const express = require('express');
const app = express();
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/upload', uploadRoutes);

const swaggerSpec = require('./config/swagger'); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.send('API Delivery online 🚀'));

module.exports = app;
