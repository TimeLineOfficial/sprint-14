const express = require('express');
const cors = require('cors');
const apiRoutes = require('../src/routes/api');

const app = express();

app.use(cors());
app.use(express.json());

// Support both /api/... and direct routing
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

module.exports = app;
