const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Create a new quiz
router.post('/create', async (req, res) => {
    try {
        const {
            title,
            subject,
            grade,
            mode,
            duration,
            numberOfQuestions,
            questions,
            deadline,
            teacherId
        } = req.body;

        // Validate required fields
        if (!title || !subject || !grade || !duration || !questions || !deadline || !teacherId) {
            return res.status(400).json({
                success: false,
                error: 'All required fields must be provided'
            });
        }

        // Validate questions
        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one question is required'
            });
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (!question.question || !Array.isArray(question.options) || question.options.length < 2) {
                return res.status(400).json({
                    success: false,
                    error: `Question ${i + 1} is invalid. Must have question text and at least 2 options.`
                });
            }
            if (question.correctAnswer === undefined || question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
                return res.status(400).json({
                    success: false,
                    error: `Question ${i + 1} has invalid correct answer index.`
                });
            }
        }

        const quiz = new Quiz({
            title,
            subject,
            grade,
            mode,
            duration,
            numberOfQuestions,
            questions,
            deadline: new Date(deadline),
            teacherId
        });

        await quiz.save();

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            quiz
        });

    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get all quizzes for a teacher
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;

        const quizzes = await Quiz.find({ teacherId })
            .populate('teacherId', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            quizzes
        });

    } catch (error) {
        console.error('Error fetching teacher quizzes:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get available quizzes for a student (based on grade)
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get student's grade
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Get quizzes for student's grade that are active and not expired
        const currentDate = new Date();
        const studentGrade = typeof student.grade === 'number'
            ? student.grade
            : parseInt(String(student.grade).replace(/[^0-9]/g, ''), 10);
        const quizzes = await Quiz.find({
            grade: studentGrade,
            isActive: true,
            deadline: { $gt: currentDate }
        })
            .populate('teacherId', 'name')
            .select('-questions.correctAnswer') // Don't send correct answers to students
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            quizzes
        });

    } catch (error) {
        console.error('Error fetching student quizzes:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get available quizzes by grade (for student dashboard)
router.get('/grade/:grade', async (req, res) => {
    try {
        const { grade } = req.params;

        // Validate grade parameter
        if (!grade) {
            return res.status(400).json({
                success: false,
                error: 'Grade parameter is required'
            });
        }

        // Get quizzes for the specified grade that are active and not expired
        const currentDate = new Date();
        const numericGrade = typeof grade === 'number' ? grade : parseInt(String(grade).replace(/[^0-9]/g, ''), 10);
        const quizzes = await Quiz.find({
            grade: numericGrade,
            isActive: true,
            deadline: { $gt: currentDate }
        })
            .populate('teacherId', 'name')
            .select('-questions.correctAnswer') // Don't send correct answers to students
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            quizzes,
            grade: grade
        });

    } catch (error) {
        console.error('Error fetching quizzes by grade:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get a specific quiz (for taking)
router.get('/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { studentId } = req.query;

        const quiz = await Quiz.findById(quizId).populate('teacherId', 'name');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        // If student is requesting, don't send correct answers
        if (studentId) {
            const student = await Student.findById(studentId);
            const studentGrade = student ? (typeof student.grade === 'number'
                ? student.grade
                : parseInt(String(student.grade).replace(/[^0-9]/g, ''), 10)) : null;
            if (!student || Number(studentGrade) !== Number(quiz.grade)) {
                return res.status(403).json({
                    success: false,
                    error: 'You are not eligible to take this quiz'
                });
            }

            // Check if student has already submitted
            const hasSubmitted = quiz.submissions.some(sub => sub.studentId.toString() === studentId);
            if (hasSubmitted) {
                return res.status(400).json({
                    success: false,
                    error: 'You have already submitted this quiz'
                });
            }

            // Remove correct answers for students
            const quizForStudent = quiz.toObject();
            quizForStudent.questions = quizForStudent.questions.map(q => {
                const { correctAnswer, ...questionWithoutAnswer } = q;
                return questionWithoutAnswer;
            });

            return res.json({
                success: true,
                quiz: quizForStudent
            });
        }

        res.json({
            success: true,
            quiz
        });

    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Submit quiz answers
router.post('/:quizId/submit', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { studentId, answers, timeTaken } = req.body;

        if (!studentId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: 'Student ID and answers are required'
            });
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        // Check if student has already submitted
        const hasSubmitted = quiz.submissions.some(sub => sub.studentId.toString() === studentId);
        if (hasSubmitted) {
            return res.status(400).json({
                success: false,
                error: 'You have already submitted this quiz'
            });
        }

        // Check if quiz is expired
        if (new Date() > quiz.deadline) {
            return res.status(400).json({
                success: false,
                error: 'Quiz deadline has passed'
            });
        }

        // Calculate score
        let totalScore = 0;
        const gradedAnswers = [];

        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            const studentAnswer = answers.find(a => a.questionIndex === i);

            if (studentAnswer) {
                const isCorrect = studentAnswer.selectedAnswer === question.correctAnswer;
                const pointsEarned = isCorrect ? question.points : 0;
                totalScore += pointsEarned;

                gradedAnswers.push({
                    questionIndex: i,
                    selectedAnswer: studentAnswer.selectedAnswer,
                    isCorrect,
                    pointsEarned
                });
            }
        }

        // Calculate percentage score
        const percentageScore = Math.round((totalScore / quiz.totalPoints) * 100);

        // Add submission to quiz
        quiz.submissions.push({
            studentId,
            score: percentageScore,
            answers: gradedAnswers,
            timeTaken
        });

        await quiz.save();

        res.json({
            success: true,
            message: 'Quiz submitted successfully',
            score: percentageScore,
            totalPoints: quiz.totalPoints,
            earnedPoints: totalScore
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Update quiz
router.put('/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;
        const updateData = req.body;

        const quiz = await Quiz.findByIdAndUpdate(quizId, updateData, { new: true });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        res.json({
            success: true,
            message: 'Quiz updated successfully',
            quiz
        });

    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Delete quiz
router.delete('/:quizId', async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findByIdAndDelete(quizId);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        res.json({
            success: true,
            message: 'Quiz deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Get quiz results for a teacher
router.get('/:quizId/results', async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId)
            .populate('submissions.studentId', 'name username grade')
            .populate('teacherId', 'name');

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found'
            });
        }

        res.json({
            success: true,
            quiz
        });

    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router; 
