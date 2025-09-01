const db = require('../../config/database');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    // QUERY MODIFICADA: Adicionamos o JOIN com a tabela 'roles' para buscar o nome da função (r.name)
    const userQuery = `
      SELECT 
        u.id, 
        u.username, 
        u.password_hash, 
        u.full_name, 
        r.name AS role 
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.username = $1
    `;
    
    const { rows } = await db.query(userQuery, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    console.log(`Login bem-sucedido para o usuário: ${user.username}`);
    
    // RESPOSTA MODIFICADA: Agora enviamos 'role' em vez de 'roleId'.
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role, // Ex: 'OPERATOR', 'SUPERVISOR'
      },
    });

  } catch (error) {
    console.error('Erro no processo de login:', error);
    res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
  }
};

module.exports = {
  login,
};