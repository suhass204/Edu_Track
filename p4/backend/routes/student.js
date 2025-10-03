const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// GET /api/student/videos?grade=10&subject=math
router.get('/videos', async (req, res) => {
    const { grade, subject } = req.query;

    try {
        const query = {};
        if (grade) query.grade = grade;
        if (subject) query.subject = subject;

        const videos = await Video.find(query);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});

module.exports = router;
