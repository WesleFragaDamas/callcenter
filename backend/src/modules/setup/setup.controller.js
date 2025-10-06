const db = require('../../config/database');
const bcrypt = require('bcryptjs');

/**
 * Verifica se o sistema já foi inicializado (se já existe um ADMIN).
 */
const getSetupStatus = async (req, res) => {
  try {
    const query = `
      SELECT COUNT(u.id) 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'ADMIN';
    `;
    const { rows } = await db.query(query);
    const adminCount = parseInt(rows[0].count, 10);

    res.status(200).json({ isInitialized: adminCount > 0 });
  } catch (error) {
    console.error("Erro ao verificar status do setup:", error);
    // Se der erro (ex: tabela 'users' não existe), assume que não foi inicializado.
    // Isso é útil na primeiríssima execução antes das migrações.
    res.status(200).json({ isInitialized: false, error: true });
  }
};

/**
 * Cria o primeiro usuário ADMIN. Só funciona se nenhum outro ADMIN existir.
 */
const initialize = async (req, res) => {
  const { username, password, full_name } = req.body;

  if (!username || !password || !full_name) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // 1. Re-verificar se já existe um admin (segurança)
    const checkQuery = `SELECT COUNT(u.id) FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'ADMIN';`;
    const checkResult = await db.query(checkQuery);
    if (parseInt(checkResult.rows[0].count, 10) > 0) {
      return res.status(403).json({ message: 'O sistema já foi inicializado.' });
    }

    // 2. Garantir que as ROLES básicas existem
    await db.query(`
      INSERT INTO roles (name) VALUES
      ('ADMIN'), ('GESTOR'), ('HELPDESK'), ('RH'), ('SUPERVISOR'), ('OPERATOR')
      ON CONFLICT (name) DO NOTHING;
    `);

    // 3. Criar o usuário ADMIN
    const password_hash = await bcrypt.hash(password, 10);
    const insertQuery = `
      INSERT INTO users (username, password_hash, full_name, role_id)
      VALUES ($1, $2, $3, (SELECT id FROM roles WHERE name = 'ADMIN'))
      RETURNING id, username;
    `;
    const { rows } = await db.query(insertQuery, [username, password_hash, full_name]);

    console.log("Sistema inicializado com sucesso! Primeiro admin criado:", rows[0]);
    res.status(201).json({ message: 'Administrador principal criado com sucesso!', user: rows[0] });

  } catch (error) {
    console.error("Erro ao inicializar o sistema:", error);
    res.status(500).json({ message: 'Erro interno no servidor durante a inicialização.' });
  }
};

module.exports = {
  getSetupStatus,
  initialize,
};