const express = require("express");
const router = express.Router();
const { analyzeProgress, getStudentProgress, getAllProgress, } = require("../controllers/progressController");

router.post("/analyze", analyzeProgress);
router.get("/:studentId", getStudentProgress);
router.get("/", getAllProgress);

module.exports = router;
