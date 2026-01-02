const express = require('express');
const router = express.Router();
const InscricaoController = require('../controllers/InscricaoController');

router.post('/', InscricaoController.criar);
router.get('/:id', InscricaoController.buscarPorId);

module.exports = router;
