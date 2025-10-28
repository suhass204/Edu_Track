// backend/routes/videoRoutes.js
const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../controllers/videoController");

router.post("/recommend", getRecommendations);

module.exports = router;
