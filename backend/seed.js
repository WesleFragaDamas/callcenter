const db = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  console.log('Iniciando o processo de seeding...');

  try {
    // === 1. SEED ROLES ===
    console.log('Inserindo roles...');
    const resultRoles = await db.query(`
      INSERT INTO roles (name) VALUES
      ('ADMIN'),
      ('GESTOR'),
      ('HELPDESK'),
      ('RH'),
      ('SUPERVISOR'),
      ('OPERATOR')
      ON CONFLICT (name) DO NOTHING;
    `);
    console.log(`Roles inseridas: ${resultRoles.rowCount}`);

    // === 2. SEED PAUSE TYPES ===
    console.log('Inserindo tipos de pausa...');
    const resultPauseTypes = await db.query(`
      INSERT INTO pause_types (name, duration_minutes) VALUES
      ('Pausa 1', 10),
      ('Pausa Lanche', 20),
      ('Pausa 2', 10)
      ON CONFLICT (name) DO NOTHING; -- Especifique a coluna do conflito
    `);
    console.log(`Tipos de pausa inseridos: ${resultPauseTypes.rowCount}`);

    // === 3. SEED USERS ===
    console.log('Preparando para inserir usuários...');

    // Criptografando as senhas
    const adminPassword = await bcrypt.hash('admin123', 10);
    const supervisorPassword = await bcrypt.hash('sup123', 10);
    const operatorPassword = await bcrypt.hash('op123', 10);

    console.log('Senhas criptografadas.');

    // Inserimos os usuários de teste
    const resultUsers = await db.query(`
      INSERT INTO users (username, password_hash, full_name, role_id) VALUES
      ('admin', $1, 'Administrador do Sistema', (SELECT id FROM roles WHERE name = 'ADMIN')),
      ('supervisor.teste', $2, 'Supervisor Teste', (SELECT id FROM roles WHERE name = 'SUPERVISOR')),
      ('operador.teste', $3, 'Operador Teste', (SELECT id FROM roles WHERE name = 'OPERATOR'))
      ON CONFLICT (username) DO NOTHING;
    `, [adminPassword, supervisorPassword, operatorPassword]);
    
    console.log(`Usuários inseridos: ${resultUsers.rowCount}`);

  } catch (error) {
    console.error('Ocorreu um erro durante o seeding:', error);
  } finally {
    console.log('Processo de seeding finalizado.');
    // Para scripts simples, o Node.js fechará o pool de conexões automaticamente ao sair.
  }
}

seedDatabase();