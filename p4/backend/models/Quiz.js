const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 2 && v.length <= 6; // At least 2 options, max 6
      },
      message: 'Quiz must have between 2 and 6 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0
  },
  points: {
    type: Number,
    default: 1,
    min: 1
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology']
  },
  grade: {
    type: Number,
    required: true,
    min:1,
    max:12
  },
  mode: {
    type: String,
    required: true,
    enum: ['test', 'practice'],
    default: 'test'
  },
  duration: {
    type: Number,
    required: true,
    min: 5,
    max: 180, // 3 hours max
    default: 30
  },
  numberOfQuestions: {
    type: Number,
    required: false,
    min: 1,
    max: 100
  },
  questions: [questionSchema],
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  submissions: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    answers: [{
      questionIndex: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
      pointsEarned: Number
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    },
    timeTaken: Number // in minutes
  }]
}, {
  timestamps: true
});

// Calculate total points before saving
quizSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  next();
});

module.exports = mongoose.model('Quiz', quizSchema); 
