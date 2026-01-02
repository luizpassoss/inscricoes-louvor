const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10
});

// TESTE DE CONEXÃO IMEDIATO
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Conectado ao MySQL com sucesso');
    conn.release();
  } catch (err) {
    console.error('❌ ERRO AO CONECTAR NO BANCO:', err.message);
  }
})();


module.exports = pool;
