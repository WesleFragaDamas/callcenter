const db = require('../../config/database');

// Função para buscar todos os operadores
const getOperators = async (req, res) => {
  try {
    // Busca todos os usuários que têm a role 'OPERATOR'
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

module.exports = {
  getOperators,
};