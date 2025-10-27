const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const Progress = require("../models/Progress");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Analyze and store progress
const analyzeProgress = async (req, res) => {
  try {
    const { studentId, quizResults, score  } = req.body;

    if (!studentId || !quizResults || !Array.isArray(quizResults)) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an educational performance analysis AI for EduTrack.
      Analyze the student's quiz performance in detail.

      Data format:
      Each quiz question includes the student's answer and the correct answer.

      Student ID: ${studentId}

      Quiz Data:
      ${JSON.stringify(quizResults, null, 2)}

      Please return the output as a JSON object with the following keys:
      - strengths
      - weaknesses
      - recommendedPath
      - confidenceLevel
      - summary
      Please ensure "confidenceLevel" is a number between 0 and 100, not a string.
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    //console.log("🧠 Gemini Raw Output:", textResponse);
    let cleanedText = textResponse
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

    // Try parsing the response safely
    let analysisData;
    try {
      analysisData = JSON.parse(cleanedText);
    } catch (err) {
      console.error("❌ JSON parse failed:", err.message);
      // Try extracting JSON manually (if AI wrapped it with ```json)
      const jsonMatch = textResponse.match(/{[\s\S]*}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        analysisData = { summary: textResponse };
      }
    }

    //console.log("✅ Parsed Analysis Data:", analysisData);
    //console.log("Student answer:",quizResults.studentAnswer,"Correct answer:",quizResults.correctAnswer);
    // ✅ Create Progress entry
    const progressEntry = new Progress({
      studentId,
      quizId: quizResults[0]?.quizId || null,
      score: score || 0,
      analysis: {
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.weaknesses || [],
        recommendedPath: analysisData.recommendedPath || [],
        confidence: analysisData.confidenceLevel || 0,
        summary: analysisData.summary || "",
      },
    });

    //console.log("📝 Data being saved to DB:", progressEntry);

    await progressEntry.save();

    res.status(200).json({
      success: true,
      message: "Progress analyzed and stored successfully",
      analysis: analysisData,
    });

  } catch (error) {
    console.error("Error analyzing progress:", error);
    res.status(500).json({ error: "Error analyzing progress" });
  }
};

const getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const progressReports = await Progress.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: progressReports,
    });
  } catch (error) {
    console.error("Error fetching student progress:", error);
    res.status(500).json({ error: "Error fetching student progress" });
  }
};

const getAllProgress = async (req, res) => {
  try {
    const reports = await Progress.find()
      .populate("studentId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("Error fetching all progress:", error);
    res.status(500).json({ error: "Error fetching all progress" });
  }
};

module.exports = { analyzeProgress, getStudentProgress, getAllProgress };
