const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: false,
  },
  score: Number,
  analysis: {
    strengths: [String],
    weaknesses: [String],
    recommendedPath: [String],
    confidence: Number,
    summary:{type:String,default:""}
  }
});

module.exports = mongoose.model("Progress", progressSchema);
