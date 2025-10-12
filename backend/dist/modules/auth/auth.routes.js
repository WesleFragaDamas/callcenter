"use strict";

var express = require('express');
var router = express.Router();
var authController = require('./auth.controller');

// Quando uma requisição POST for feita para /login, execute a função login do controller
router.post('/login', authController.login);
module.exports = router;