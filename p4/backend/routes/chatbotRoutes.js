const express = require('express');
const { handleChat } = require("../controllers/chatbotController.js");

const router = express.Router();

// POST /api/chatbot/query
router.post("/query", handleChat);

module.exports = router;