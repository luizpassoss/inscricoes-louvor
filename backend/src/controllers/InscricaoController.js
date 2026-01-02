const InscricaoService = require('../services/InscricaoService');
exports.criar = async (req, res) => {
  try {
    console.log('REQ.BODY >>>', req.body); // 👈 ESSENCIAL
    const inscricao = await InscricaoService.criar(req.body);
    res.status(201).json(inscricao);
  } catch (err) {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'Já existe uma inscrição com este CPF'
    });
  }

  res.status(400).json({ error: err.message });
}

};



exports.buscarPorId = async (req, res) => {
  try {
    const inscricao = await InscricaoService.buscarPorId(req.params.id);
    res.json(inscricao);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
