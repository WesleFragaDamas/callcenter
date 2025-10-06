const express = require('express');
const router = express.Router();
const setupController = require('./setup.controller');

// Rota para verificar o status da instalação
// GET /api/setup/status
router.get('/status', setupController.getSetupStatus);

// Rota para criar o primeiro administrador
// POST /api/setup/initialize
router.post('/initialize', setupController.initialize);

module.exports = router;