const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.get('/inscricoes', AdminController.listarInscricoes);
router.get('/stats', AdminController.stats);
router.post('/confirmar/:id', AdminController.confirmarPagamento);
router.delete('/inscricoes/:id', AdminController.deletarInscricao);
router.put('/inscricoes/:id', AdminController.atualizarInscricao);
router.get('/inscricoes/:id', AdminController.buscarInscricaoPorId);

module.exports = router;
