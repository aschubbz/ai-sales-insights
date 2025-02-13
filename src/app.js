require('dotenv').config();
const express = require('express');
const salesRoutes = require('./routes/sales');

const app = express();
app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'Sales Insights API is up and running!' });
});

// Main routes
app.use('/sales', salesRoutes);

module.exports = app;
