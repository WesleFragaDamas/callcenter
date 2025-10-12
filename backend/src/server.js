import express from 'express'; // Podemos usar 'import' se o Babel estiver configurado
import cors from 'cors';
import path from 'path'; // Módulo nativo do Node.js
import db from './config/database';

// Importando todos os nossos módulos de rotas
import setupRoutes from './modules/setup/setup.routes';
import authRoutes from './modules/auth/auth.routes';
import pauseRoutes from './modules/pauses/pauses.routes';
import userRoutes from './modules/users/users.routes';
import roleRoutes from './modules/roles/roles.routes';

const app = express();
const PORT = 5000;

// === Middlewares ===
app.use(cors());
app.use(express.json());

// --- SERVIR O FRONTEND EM PRODUÇÃO ---
// Pega o caminho absoluto para a pasta 'backend'
const __dirname = path.resolve(); 
// Diz ao Express para servir os arquivos estáticos da pasta 'build' do frontend
// que estará ao lado da pasta 'dist' do backend.
app.use(express.static(path.join(__dirname, 'build')));


// === Rotas da API ===
// Todas as nossas rotas de API devem vir DEPOIS de servir os arquivos estáticos
app.use('/api/setup', setupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pauses', pauseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);


// --- ROTA "CATCH-ALL" PARA O REACT ROUTER ---
// Esta rota deve ser a ÚLTIMA. Qualquer requisição GET que não foi
// pega por uma rota da API acima, será redirecionada para o index.html do React.
// Isso permite que o roteamento do próprio React funcione.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


// Função para testar a conexão com o banco de dados
const testDbConnection = async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('Conexão com o banco de dados PostgreSQL bem-sucedida!');
  } catch (err) {
    console.error('Erro ao conectar com o banco de dados:', err);
    process.exit(1);
  }
};

// Função principal para iniciar o servidor
const startServer = async () => {
  await testDbConnection();
  app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
  });
};

startServer();