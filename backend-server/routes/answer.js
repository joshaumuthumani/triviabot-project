const express = require('express');
const router = express.Router();
const supabase = require('../../supabaseClient');

// POST /api/answers
router.post('/', async (req, res) => {
  const { user_id, user_tag, question_id, answer, is_correct } = req.body;

  const { data, error } = await supabase
    .from('answers')
    .insert([{ user_id, user_tag, question_id, answer, is_correct }])
    .select();

  if (error) {
    console.error('Error saving answer:', error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data[0]);
});

module.exports = router;