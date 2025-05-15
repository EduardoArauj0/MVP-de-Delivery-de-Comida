const express = require('express');
const app = express();

app.use(express.json());

const restauranteRoutes = require('./routes/restauranteRoutes');
app.use('/restaurantes', restauranteRoutes);

app.get('/', (req, res) => res.send('API Delivery online 🚀'));

module.exports = app;
