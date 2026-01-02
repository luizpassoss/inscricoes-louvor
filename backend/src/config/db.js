const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',        // 👈 seu usuário MySQL
  password: '',        // 👈 sua senha (vazia se não tiver)
  database: 'eventos_igreja',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
