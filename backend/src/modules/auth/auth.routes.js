const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Quando uma requisição POST for feita para /login, execute a função login do controller
router.post('/login', authController.login);

module.exports = router;