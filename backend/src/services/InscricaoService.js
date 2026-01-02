const pool = require('../config/db');

exports.criar = async (data) => {
  const {
    nome,
    cpf,
    telefone,
    email,
    forma_pagamento,
    plenaria
  } = data;

  // Validações
  if (!nome || !telefone || !email || !forma_pagamento || !plenaria) {
    throw new Error('Dados obrigatórios não informados');
  }

  if (!['PIX', 'CARTAO'].includes(forma_pagamento)) {
    throw new Error('Forma de pagamento inválida');
  }

  if (!cpf) {
    throw new Error('CPF é obrigatório');
  }

  if (cpf.length !== 11) {
    throw new Error('CPF inválido');
  }

  // Inserção no banco
  const [result] = await pool.query(
    `INSERT INTO inscricoes 
     (nome, cpf, telefone, email, forma_pagamento, plenaria, status_pagamento)
     VALUES (?, ?, ?, ?, ?, ?, 'PENDENTE')`,
    [nome, cpf, telefone, email, forma_pagamento, plenaria]
  );

  // Retorno
  return {
    id: result.insertId,
    nome,
    email,
    forma_pagamento,
    plenaria,
    status_pagamento: 'PENDENTE'
  };
};

exports.buscarPorId = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM inscricoes WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    throw new Error('Inscrição não encontrada');
  }

  return rows[0];
};
