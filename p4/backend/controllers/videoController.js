// backend/controllers/videoController.js
const { spawn } = require("child_process");
const Video = require("../models/Video");

exports.getRecommendations = async (req, res) => {
  try {
    const { grade, subject } = req.body;

    const python = spawn("python", ["./python/video_recommendation.py"]);
    let data = "";

    python.stdin.write(JSON.stringify({ grade, subject }));
    python.stdin.end();

    python.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    python.on("close", async () => {
      try {
        const result = JSON.parse(data);
        const recommendedIds = result.recommendations;

        const videos = await Video.find({ _id: { $in: recommendedIds } });
        res.json({ success: true, videos });
      } catch (e) {
        console.error("Python Output Parse Error:", e);
        res.status(500).json({ success: false, error: "Python script error" });
      }
    });

    python.stderr.on("data", (err) => {
      console.error("Python Error:", err.toString());
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
