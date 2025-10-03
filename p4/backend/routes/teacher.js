const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// POST /api/teacher/add-video
router.post('/add-video', async (req, res) => {
    const { title, description, url, grade, subject, addedBy } = req.body;

    try {
        const newVideo = new Video({
            title,
            description,
            url,
            grade,
            subject,
            addedBy
        });

        await newVideo.save();
        res.status(201).json({ message: 'Video added successfully', video: newVideo });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add video' });
    }
});

module.exports = router;
