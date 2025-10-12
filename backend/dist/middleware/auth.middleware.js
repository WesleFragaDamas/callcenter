"use strict";

var jwt = require('jsonwebtoken');

// Middleware para proteger rotas e verificar a role do usuário
var protect = function protect(requiredRole) {
  return function (req, res, next) {
    var _req$headers$authoriz;
    var token = (_req$headers$authoriz = req.headers.authorization) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.split(' ')[1]; // Espera "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        message: 'Acesso negado. Nenhum token fornecido.'
      });
    }
    try {
      var decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Adiciona os dados do usuário do token ao objeto 'req'

      // Se uma role específica é requerida, verifica se o usuário a possui
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({
          message: 'Acesso negado. Você não tem permissão.'
        });
      }
      next(); // Se tudo estiver OK, passa para a próxima função (o controller)
    } catch (error) {
      res.status(401).json({
        message: 'Token inválido.'
      });
    }
  };
};
module.exports = {
  protect: protect
};