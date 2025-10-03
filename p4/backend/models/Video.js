const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    grade: String,
    subject: String,
    addedBy: String, // teacher id or name
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Video', videoSchema);
