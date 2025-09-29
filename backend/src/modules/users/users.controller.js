const db = require('../../config/database');
const bcrypt = require('bcryptjs');

// FUNÇÃO 1: Busca todos os usuários (para o admin)
const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.username, u.full_name, r.name as role, u.is_active
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.full_name ASC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar todos os usuários:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// FUNÇÃO 2: Busca apenas os operadores ATIVOS
const getOperators = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.full_name, u.username
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'OPERATOR' AND u.is_active = true
      ORDER BY u.full_name ASC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar operadores:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// FUNÇÃO 3: Cria um novo usuário
const createUser = async (req, res) => {
  const { username, password, full_name, role_id } = req.body;
  if (!username || !password || !full_name || !role_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, password_hash, full_name, role_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, full_name, role_id;
    `;
    const { rows } = await db.query(query, [username, password_hash, full_name, role_id]);
    res.status(201).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Nome de usuário já existe.' });
    }
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// FUNÇÃO 4 (NOVA): Atualiza um usuário
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, full_name, role_id } = req.body;
  if (!username || !full_name || !role_id) {
    return res.status(400).json({ message: 'Nome, nome de usuário e função são obrigatórios.' });
  }
  try {
    const query = `
      UPDATE users SET username = $1, full_name = $2, role_id = $3
      WHERE id = $4 RETURNING id, username, full_name, role_id;
    `;
    const { rows } = await db.query(query, [username, full_name, role_id, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Nome de usuário já existe.' });
    }
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// FUNÇÃO 5 (NOVA): Desativa/Reativa um usuário
const toggleUserActive = async (req, res) => {
  const { userId } = req.params;
  const { is_active } = req.body;
  if (typeof is_active !== 'boolean') {
    return res.status(400).json({ message: 'O estado "is_active" é obrigatório e deve ser booleano.' });
  }
  try {
    const query = `
      UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, is_active;
    `;
    const { rows } = await db.query(query, [is_active, userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao ativar/desativar usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

module.exports = {
  getAllUsers,
  getOperators,
  createUser,
  updateUser,
  toggleUserActive,
};
