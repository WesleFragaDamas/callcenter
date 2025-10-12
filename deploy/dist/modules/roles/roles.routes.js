"use strict";

var express = require('express');
var router = express.Router();
var rolesController = require('./roles.controller');
var _require = require('../../middleware/auth.middleware'),
  protect = _require.protect;

// Rota para buscar todas as roles (protegida para admin)
router.get('/', protect('ADMIN'), rolesController.getAllRoles);
module.exports = router;