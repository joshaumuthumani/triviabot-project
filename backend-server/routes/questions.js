const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).single('attachment');
const axios = require('axios');
const supabase = require('../supabaseClient'); // Adjusted path

require('dotenv').config();
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// GET latest trivia question
router.get('/latest', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching latest question', error: err.message });
  }
});

// POST a new trivia question
router.post('/', upload, async (req, res) => {
  try {
    const { question, answer, endTime } = req.body;
    let attachmentUrl = null;

    if (req.file) {
      attachmentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          question,
          correct_answer: answer,
          end_time: endTime,
          image_url: attachmentUrl
        }
      ])
      .select();

    if (error) throw error;

    // Post to Discord
    const content = `**New Trivia Question!**\n${question}\n_Ends at ${new Date(endTime).toLocaleString()}_`;
    const payload = { content };

    if (attachmentUrl) {
      payload.embeds = [{ image: { url: attachmentUrl } }];
    }

    await axios.post(DISCORD_WEBHOOK_URL, payload);

    res.status(201).json({ message: 'Question saved and posted to Discord!' });
  } catch (err) {
    console.error('Error saving or posting question:', err);
    res.status(500).json({ message: 'Error saving or posting question', error: err.message });
  }
});

module.exports = router;