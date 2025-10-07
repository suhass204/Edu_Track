// routes/notes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Note = require('../models/Note');

const router = express.Router();

// Set up storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'));
    }
    cb(null, true);
  }
});

// Upload note with grade
router.post('/upload', upload.single('note'), async (req, res) => {
  try {
    const { grade } = req.body;
    if (!grade) return res.status(400).json({ error: 'Grade is required' });

    const newNote = new Note({
      filename: req.file.filename,
      grade
    });

    await newNote.save();
    res.status(201).json({ message: 'Note uploaded successfully', note: newNote });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get notes by grade
router.get('/grade/:grade', async (req, res) => {
  try {
    const notes = await Note.find({ grade: req.params.grade });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
