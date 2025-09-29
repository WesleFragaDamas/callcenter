const db = require('../../config/database');
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.username, u.full_name, r.name as role
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

const getOperators = async (req, res) => {
  try {
    const query = `
      SELECT u.id, u.full_name, u.username
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE r.name = 'OPERATOR'
      ORDER BY u.full_name ASC;
    `;
    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar operadores:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// --- FUNÇÃO CORRIGIDA ---
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
    // CORREÇÃO: Usamos a variável 'full_name' (com underscore), que é a que recebemos do req.body
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

module.exports = {
  getAllUsers,
  getOperators,
  createUser,
};
