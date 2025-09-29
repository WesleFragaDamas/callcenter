const express = require('express');
const router = express.Router();
const usersController = require('./users.controller');
const { protect } = require('../../middleware/auth.middleware');

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