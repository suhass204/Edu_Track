const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Controller function to handle chat queries
const handleChat = async (req, res) => {
  try {
    const { query, userRole } = req.body; // userRole can be 'student' or 'teacher'

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Use Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Role-specific system prompt
    const rolePrompt =
      userRole === "teacher"
        ? "You are EduTrack's AI assistant for teachers. Help teachers with student management, quiz creation, and educational support."
        : "You are EduTrack's AI assistant for students. Help students understand subjects, prepare for tests, and learn concepts clearly.";

    // Final prompt
    const prompt = `${rolePrompt}\n\nUser Query: ${query}`;

    // Generate response
    const result = await model.generateContent(prompt);

    // ✅ Access the text correctly
    const textResponse = result.response.text();

    // Send clean JSON response
    res.status(200).json({
      success: true,
      role: userRole,
      query,
      response: textResponse,
    });
  } catch (error) {
    console.error("❌ Chatbot error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process chatbot request.",
    });
  }
};

module.exports = { handleChat };
