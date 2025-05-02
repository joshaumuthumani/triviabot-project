require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const questionRoutes = require('./routes/questions');

// Suppress Mongoose strictQuery deprecation warning
mongoose.set('strictQuery', true);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (audio/video) from the `uploads` folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/questions', questionRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Start Server
const PORT = process.env.BACKEND_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Backend API running on port ${PORT}`);
});