const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { protect } = require('../../middleware/auth.middleware');

// Rota para o supervisor buscar a lista de operadores da equipe (acesso para Supervisor e Admin)
router.get('/operators', protect(), usersController.getOperators);

// Rota para o admin buscar a lista de TODOS os usuários
router.get('/', protect('ADMIN'), usersController.getAllUsers);

// Rota para o admin criar um novo usuário
router.post('/', protect('ADMIN'), usersController.createUser);

// Rotas de Update e Delete virão aqui.

module.exports = router;