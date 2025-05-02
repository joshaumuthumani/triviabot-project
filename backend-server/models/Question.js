const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question:    { type: String, required: true },
  answer:      { type: String, required: true },
  endTime:     { type: Date,   required: true },
  attachments: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);
