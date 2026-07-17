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

// --- USER CRUD ROUTES ---

// READ all users
app.get('/api/user', async (req, res) => {
  try {
    const { data, error } = await supabase.from('user').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ status: 'success', data: data });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// CREATE a new user
app.post('/api/user', async (req, res) => {
  try {
    const { f_name, l_name, username } = req.body;
    const { data, error } = await supabase.from('user').insert([{ f_name, l_name, username }]).select();
    if (error) throw error;
    res.json({ status: 'success', data: data[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// UPDATE an existing user
app.put('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { f_name, l_name, username } = req.body;
    const { data, error } = await supabase.from('user').update({ f_name, l_name, username }).eq('id', id).select();
    if (error) throw error;
    res.json({ status: 'success', data: data[0] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE a user
app.delete('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('user').delete().eq('id', id);
    if (error) throw error;
    res.json({ status: 'success', message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
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
