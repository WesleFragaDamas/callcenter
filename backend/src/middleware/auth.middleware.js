const jwt = require('jsonwebtoken');

// Middleware para proteger rotas e verificar a role do usuário
const protect = (requiredRole) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Espera "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário do token ao objeto 'req'

    // Se uma role específica é requerida, verifica se o usuário a possui
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão.' });
    }

    next(); // Se tudo estiver OK, passa para a próxima função (o controller)
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = { protect };