const express = require('express');
const router = express.Router();
const pausesController = require('./pauses.controller');

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

module.exports = router;