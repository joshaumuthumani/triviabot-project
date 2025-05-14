require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Routes
const questionRoutes = require('./routes/questions');
const winnerRoutes = require('./routes/winners');
const answerRoutes = require('./routes/answer'); // ✅ Corrected from 'answers' to 'answer'

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/answers', answerRoutes);

// Start server
const PORT = process.env.BACKEND_PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Backend API running on port ${PORT}`);
});