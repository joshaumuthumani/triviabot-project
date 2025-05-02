const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer().single('attachment');
const Question = require('../models/Question');
const axios = require('axios');
require('dotenv').config();
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// GET latest trivia question
router.get('/latest', async (req, res) => {
  try {
    const latest = await Question.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching latest question', error: err });
  }
});

// POST a new trivia question
router.post('/', upload, async (req, res) => {
  try {
    const { question, answer, endTime } = req.body;
    let attachments = [];
    if (req.file) {
      // Assuming you store uploads statically and serve at /uploads
      const filePath = `/uploads/${req.file.filename}`;
      attachments.push(`${req.protocol}://${req.get('host')}${filePath}`);
    }

    const newQ = new Question({ question, answer, endTime, attachments });
    await newQ.save();

    // Push to Discord via incoming webhook
    const content = `**New Trivia Question!**\n${question}\n_Ends at ${new Date(endTime).toLocaleString()}_`;
    const payload = { content };
    // If there's an attachment, embed it
    if (attachments.length) {
      payload.embeds = [{ image: { url: attachments[0] } }];
    }
    await axios.post(DISCORD_WEBHOOK_URL, payload);

    res.status(201).json({ message: 'Question saved and posted to Discord!' });
  } catch (err) {
    console.error('Error saving or posting question:', err);
    res.status(500).json({ message: 'Error saving or posting question', error: err });
  }
});

module.exports = router;
