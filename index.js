require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase (it uses the variables from your .env file)
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Database Test Route
app.get('/api/database', async (req, res) => {
  try {
    // This tries to fetch from a table named "user" 
    const { data, error } = await supabase.from('user').select('*').limit(5);

    if (error) throw error;

    res.json({
      status: 'success',
      data: data
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
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
