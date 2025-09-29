const db = require('../../config/database');

const getAllRoles = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM roles ORDER BY name');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar roles:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

module.exports = {
  getAllRoles,
};