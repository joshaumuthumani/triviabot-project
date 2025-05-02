const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const questionRoutes = require('./routes/questions');

require('dotenv').config(); // Optional if you're using .env for MongoDB URI

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/questions', questionRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.BACKEND_PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});