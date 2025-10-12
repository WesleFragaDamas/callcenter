"use strict";

var express = require('express');
var router = express.Router();
var usersController = require('./users.controller');
var _require = require('../../middleware/auth.middleware'),
  protect = _require.protect;

// --- GET ---
router.get('/', protect('ADMIN'), usersController.getAllUsers);
router.get('/operators', protect(), usersController.getOperators);

// --- POST ---
router.post('/', protect('ADMIN'), usersController.createUser);

// --- PUT (Update) ---
router.put('/:userId', protect('ADMIN'), usersController.updateUser);
// Para ativar/desativar, usamos PUT também pois é uma atualização de estado
router.put('/toggle-active/:userId', protect('ADMIN'), usersController.toggleUserActive);
module.exports = router;