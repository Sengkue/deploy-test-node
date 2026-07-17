require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (our UI)
app.use(express.static('public'));

// Data Route
app.get('/api/data', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to the basic Node.js API!',
    timestamp: new Date().toISOString()
  });
});

// Another Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime()
  });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
