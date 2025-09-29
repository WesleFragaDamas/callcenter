const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const path = require('path'); // Importe o módulo 'path' do Node.js


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

// === SERVIR ARQUIVOS ESTÁTICOS DO FRONTEND (PRODUÇÃO) ===
// Diz ao Express para usar a pasta 'build' para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'build')));

// === Rotas da API ===
app.use('/api/auth', authRoutes);
// ... (outras rotas da API)

// === ROTA "CATCH-ALL" PARA O FRONTEND ===
// Qualquer requisição GET que não corresponda a uma rota da API acima
// será redirecionada para o arquivo principal do React (index.html).
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// Função principal para iniciar o servidor
const startServer = async () => {
  await testDbConnection();
  app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
  });
};

startServer();