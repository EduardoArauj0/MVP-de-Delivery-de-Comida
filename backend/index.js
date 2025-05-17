const app = require('./src/app');
const { sequelize } = require('./src/models');
const seedDatabase = require('./src/seeders/seed');

const PORT = process.env.PORT || 3000;

async function startServer() {
  let tentativas = 0;
  const maxTentativas = 10;
  const delay = 3000;

  while (tentativas < maxTentativas) {
    try {
      console.log(`Tentando conectar ao banco (tentativa ${tentativas + 1})...`);
      await sequelize.authenticate();
      console.log('Conectado ao banco com sucesso!');
      await sequelize.sync({ alter: true });

      await seedDatabase();

      app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
      });

      break; // conexão feita com sucesso, sai do loop
    } catch (error) {
      console.error(`Erro ao conectar ao banco: ${error.message}`);
      tentativas++;
      if (tentativas === maxTentativas) {
        console.error('Não foi possível conectar ao banco após várias tentativas.');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

startServer();
