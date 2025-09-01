// Carrega as variáveis do arquivo .env para o ambiente
require('dotenv').config();

// Importa o cliente do PostgreSQL
const { Client } = require('pg');

// Função principal assíncrona
async function checkDatabaseConnection() {
  console.log('--- INICIANDO TESTE DE CONEXÃO DIRETA ---');
  
  // Imprime as variáveis que estamos tentando usar para ter certeza que foram carregadas
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Porta: ${process.env.DB_PORT}`);
  console.log(`Usuário: ${process.env.DB_USER}`);
  console.log(`Banco: ${process.env.DB_DATABASE}`);
  // Não vamos imprimir a senha por segurança
  
  // Cria uma nova instância do cliente
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });

  try {
    // Tenta conectar
    await client.connect();
    console.log('✅ SUCESSO! Conexão com o banco de dados estabelecida.');
    
    // Tenta executar uma query simples
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query de teste executada com sucesso. Hora do servidor de banco de dados:', result.rows[0].now);

  } catch (error) {
    console.error('❌ FALHA! Ocorreu um erro ao tentar conectar ou executar a query.');
    console.error(error); // Imprime o erro detalhado
  } finally {
    // Garante que a conexão seja fechada, não importa se deu certo ou errado
    await client.end();
    console.log('--- TESTE FINALIZADO ---');
  }
}

// Executa a função
checkDatabaseConnection();