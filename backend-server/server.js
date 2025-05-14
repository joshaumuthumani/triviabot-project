const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Routes
const questionRoutes = require('./routes/questions');
const winnerRoutes = require('./routes/winners');
const answerRoutes = require('./routes/answers');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., attachments)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/answers', answerRoutes);

// Start Server
const PORT = process.env.BACKEND_PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});