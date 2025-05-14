const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST /api/winners — Add a new winner
router.post('/', async (req, res) => {
  const { user_id, user_tag, question_id } = req.body;

  const { data, error } = await supabase
    .from('winners')
    .insert([{ user_id, user_tag, question_id }])
    .select();

  if (error) {
    console.error('Error inserting winner:', error);
    return res.status(500).json({ message: 'Failed to record winner', error: error.message });
  }

  res.status(201).json(data[0]);
});

// GET /api/winners — Optional: List all winners
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('winners')
    .select('*')
    .order('won_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;