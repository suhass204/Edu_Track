// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  filename: String,
  grade: String,
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema);
