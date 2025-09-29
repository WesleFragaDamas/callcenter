const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Importe a nova biblioteca

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    const userQuery = `
      SELECT u.id, u.username, u.password_hash, u.full_name, r.name AS role 
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

    // --- LÓGICA DO JWT ---
    // 2. Crie o "payload" - as informações que queremos guardar dentro do token
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // 3. Gere o token usando o payload, a chave secreta e uma opção de expiração
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' } // Token expira em 8 horas
    );

    console.log(`Token gerado para o usuário: ${user.username}`);
    
    // 4. Retorne o token junto com os dados do usuário
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        role: user.role,
      },
      token: token, // Envia o token para o frontend
    });

  } catch (error) {
    console.error('Erro no processo de login:', error);
    res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
  }
};

module.exports = {
  login,
};