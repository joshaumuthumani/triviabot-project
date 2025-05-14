require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://trivia.willflexbot.uk'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const questionRoutes = require('./routes/questions');
const winnerRoutes = require('./routes/winners');
const answerRoutes = require('./routes/answer');

app.use('/api/questions', questionRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/answers', answerRoutes);

// Start server
const PORT = process.env.BACKEND_PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend API running on port ${PORT}`);
});