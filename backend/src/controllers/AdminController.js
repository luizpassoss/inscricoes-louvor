const pool = require('../config/db');

exports.listarInscricoes = async (req, res) => {
  const [rows] = await pool.query(`
    SELECT id, nome, email, cpf, plenaria, forma_pagamento, status_pagamento, created_at
    FROM inscricoes
    ORDER BY created_at DESC
  `);
  res.json(rows);
};

exports.stats = async (req, res) => {
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM inscricoes'
  );
  res.json({ total });
};

exports.confirmarPagamento = async (req, res) => {
  const { id } = req.params;

  const [result] = await pool.query(
    `UPDATE inscricoes 
     SET status_pagamento = 'CONFIRMADO'
     WHERE id = ?`,
    [id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Inscrição não encontrada' });
  }

  res.json({ message: 'Pagamento confirmado' });
};
exports.deletarInscricao = async (req, res) => {
  const { id } = req.params;

  const [result] = await pool.query(
    'DELETE FROM inscricoes WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Inscrição não encontrada' });
  }

  res.json({ message: 'Inscrição removida com sucesso' });
};
exports.atualizarInscricao = async (req, res) => {
  const { id } = req.params;
  const { nome, email, cpf, telefone, plenaria } = req.body;

  const [result] = await pool.query(
    `UPDATE inscricoes 
     SET nome = ?, email = ?, cpf = ?, telefone = ?, plenaria = ?
     WHERE id = ?`,
    [nome, email, cpf, telefone, plenaria, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Inscrição não encontrada' });
  }

  res.json({ message: 'Inscrição atualizada com sucesso' });
};
exports.buscarInscricaoPorId = async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM inscricoes WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Inscrição não encontrada' });
  }
  res.json(rows[0]);
};
