const mongoose = require('mongoose')

const WinnerSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  userTag:  { type: String, required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  wonAt:    { type: Date, default: Date.now }
})

module.exports = mongoose.model('Winner', WinnerSchema)