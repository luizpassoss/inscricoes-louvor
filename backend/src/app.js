const path = require('path');
const cors = require('cors');
const express = require('express');

const app = express();

// 🔓 CORS LIBERADO (evento pequeno)
app.use(cors());

app.use(express.json());

// =======================
// SERVIR FRONTEND
// =======================

// Front-end público
const publicPath = path.join(__dirname, '../../front-end/public');
app.use('/', express.static(publicPath));

// Front-end admin
const adminPath = path.join(__dirname, '../../front-end/admin');
app.use('/admin', express.static(adminPath));

// =======================
// ROTAS DA API
// =======================
app.use('/api/inscricoes', require('./routes/inscricoes.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

module.exports = app;
