const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// Importando TODOS os nossos módulos de rotas
const authRoutes = require('./modules/auth/auth.routes'); 
const pauseRoutes = require('./modules/pauses/pauses.routes');
const userRoutes = require('./modules/users/users.routes');
const roleRoutes = require('./modules/roles/roles.routes'); // <-- LINHA FALTANTE

const app = express();
const PORT = 5000;

// === Middlewares ===
app.use(cors());
app.use(express.json());

// === Rotas ===
app.get('/', (req, res) => {
  res.send('<h1>API do Call Center está funcionando!</h1>');
});

// Registrando TODOS os nossos módulos de rotas
app.use('/api/auth', authRoutes);
app.use('/api/pauses', pauseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes); // <-- LINHA FALTANTE

// Função para testar a conexão com o banco de dados
async function testDbConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Conexão com o banco de dados PostgreSQL bem-sucedida!');
  } catch (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    process.exit(1);
  }
}

// Função principal para iniciar o servidor
const startServer = async () => {
  await testDbConnection();
  app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
  });
};

startServer();