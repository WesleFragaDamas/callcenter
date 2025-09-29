const express = require('express');
const router = express.Router();
const rolesController = require('./roles.controller');
const { protect } = require('../../middleware/auth.middleware');

// Rota para buscar todas as roles (protegida para admin)
router.get('/', protect('ADMIN'), rolesController.getAllRoles);

module.exports = router;