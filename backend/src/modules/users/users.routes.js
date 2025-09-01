const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');

// Rota para o supervisor buscar a lista de operadores da equipe
router.get('/operators', usersController.getOperators);

module.exports = router;