"use strict";

var express = require('express');
var router = express.Router();
var pausesController = require('./pauses.controller');
var _require = require('../../middleware/auth.middleware'),
  protect = _require.protect;

// Rota para buscar a lista de tipos de pausa
router.get('/types', pausesController.getPauseTypes);

// Rota para o supervisor buscar as solicitações pendentes
router.get('/pending', pausesController.getPendingRequests);

// Rota para o operador buscar uma solicitação específica
router.get('/request/:requestId', pausesController.getRequestById);

// Rota para o operador solicitar uma nova pausa
router.post('/request', pausesController.requestPause);

// Rota para o supervisor aprovar uma solicitação
router.post('/approve/:requestId', pausesController.approveRequest);

// Rota para o supervisor rejeitar uma solicitação
router.post('/reject/:requestId', pausesController.rejectRequest);

// Rota para o operador cancelar sua própria solicitação
router.post('/cancel/:requestId', pausesController.cancelRequest);

// Rota para o operador iniciar uma pausa aprovada
router.post('/start/:requestId', pausesController.startPause);

// Rota para o operador finalizar uma pausa em andamento
router.post('/end/:requestId', pausesController.endPause);

// Rota para o operador buscar seu estado de pausa atual
router.get('/active-request/:userId', pausesController.getActiveRequestByUser);

// Rota para o supervisor buscar dados para o dashboard de monitoramento
router.get('/monitor', pausesController.getPauseMonitor);

// Rota para o supervisor forçar uma pausa
router.post('/force', pausesController.forcePause);

// Rota para criar um novo tipo de pausa
router.post('/types', pausesController.createPauseType);

// Rota para atualizar um tipo de pausa
// Usamos PUT para atualizações
router.put('/types/:typeId', pausesController.updatePauseType);

// Rota para deletar um tipo de pausa
router["delete"]('/types/:typeId', pausesController.deletePauseType);

// Rotas públicas (qualquer usuário logado pode acessar)
router.get('/types', pausesController.getPauseTypes);

// Rotas de Administração (SÓ ADMIN PODE ACESSAR)
// O middleware 'protect('ADMIN')' será executado antes do controller.
router.post('/types', protect('ADMIN'), pausesController.createPauseType);
router.put('/types/:typeId', protect('ADMIN'), pausesController.updatePauseType);
router["delete"]('/types/:typeId', protect('ADMIN'), pausesController.deletePauseType);

// Rota para o supervisor forçar a finalização de uma pausa
router.post('/force-end/:requestId', pausesController.forceEndPause);
module.exports = router;