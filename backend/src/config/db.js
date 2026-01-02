const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,

  // ⚠️ ATENÇÃO AQUI
  database: process.env.DB_NAME || process.env.MYSQLDATABASE,

  port: Number(process.env.DB_PORT),

  ssl: {
    rejectUnauthorized: false
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// TESTE DE CONEXÃO (IMPORTANTE)
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ CONECTADO AO BANCO MYSQL COM SSL');
    conn.release();
  } catch (err) {
    console.error('❌ ERRO AO CONECTAR NO BANCO:', err.message);
  }
})();

module.exports = pool;
