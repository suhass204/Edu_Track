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
            .populate('submissions.studentId', 'name username grade')
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

// Get student progress reports for a teacher
router.get('/teacher/:teacherId/progress', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { grade } = req.query;

        // Get all students in the selected grade (or all students if "All Classes")
        let studentQuery = {};
        if (grade && grade !== 'All Classes') {
            const numericGrade = parseInt(grade.replace('Grade ', ''));
            studentQuery.grade = numericGrade;
        }

        const Student = require('../models/Student');
        const allStudents = await Student.find(studentQuery).select('name username grade email');

        // Get all quizzes that students in this grade might have taken
        // This includes quizzes created by any teacher for this grade
        let quizQuery = {};
        if (grade && grade !== 'All Classes') {
            const numericGrade = parseInt(grade.replace('Grade ', ''));
            quizQuery.grade = numericGrade;
        }

        const quizzes = await Quiz.find(quizQuery)
            .populate('submissions.studentId', 'name username grade')
            .populate('teacherId', 'name')
            .sort({ createdAt: -1 });

        // Calculate progress metrics from quiz submissions
        const allSubmissions = [];
        quizzes.forEach(quiz => {
            quiz.submissions.forEach(submission => {
                allSubmissions.push({
                    studentId: submission.studentId._id,
                    studentName: submission.studentId.name,
                    studentGrade: submission.studentId.grade,
                    quizId: quiz._id,
                    quizTitle: quiz.title,
                    quizSubject: quiz.subject,
                    quizTeacher: quiz.name,
                    score: submission.score,
                    submittedAt: submission.submittedAt,
                    timeTaken: submission.timeTaken,
                    answers: submission.answers
                });
            });
        });

        // Group by student with detailed quiz information
        const studentStats = {};
        allSubmissions.forEach(sub => {
            if (!studentStats[sub.studentId]) {
                studentStats[sub.studentId] = {
                    name: sub.studentName,
                    grade: sub.studentGrade,
                    scores: [],
                    quizzes: [],
                    totalQuizzes: 0,
                    averageScore: 0,
                    lastSubmission: null
                };
            }
            studentStats[sub.studentId].scores.push(sub.score);
            studentStats[sub.studentId].quizzes.push({
                quizId: sub.quizId,
                title: sub.quizTitle,
                subject: sub.quizSubject,
                teacher: sub.quizTeacher,
                score: sub.score,
                submittedAt: sub.submittedAt,
                timeTaken: sub.timeTaken
            });
            studentStats[sub.studentId].totalQuizzes++;
            studentStats[sub.studentId].lastSubmission = sub.submittedAt;
        });

        // Calculate averages and improvements
        const studentsWithData = Object.values(studentStats).map(student => {
            const scores = student.scores;
            const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

            // Calculate improvement (compare first half vs second half of scores)
            let improvement = 0;
            if (scores.length >= 4) {
                const midPoint = Math.floor(scores.length / 2);
                const firstHalf = scores.slice(0, midPoint);
                const secondHalf = scores.slice(midPoint);
                const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
                const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
                improvement = Math.round(secondHalfAvg - firstHalfAvg);
            }

            return {
                ...student,
                averageScore,
                improvement: improvement > 0 ? `+${improvement}%` : `${improvement}%`
            };
        });

        // Create comprehensive student list including those without quiz data
        const comprehensiveStudentList = allStudents.map(student => {
            const studentData = studentStats[student._id.toString()];
            if (studentData) {
                // Student has quiz data
                const scores = studentData.scores;
                const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

                let improvement = 0;
                if (scores.length >= 4) {
                    const midPoint = Math.floor(scores.length / 2);
                    const firstHalf = scores.slice(0, midPoint);
                    const secondHalf = scores.slice(midPoint);
                    const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
                    const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
                    improvement = Math.round(secondHalfAvg - firstHalfAvg);
                }

                return {
                    _id: student._id,
                    name: student.name,
                    username: student.username,
                    grade: student.grade,
                    email: student.email,
                    scores: scores,
                    quizzes: studentData.quizzes,
                    totalQuizzes: studentData.totalQuizzes,
                    averageScore,
                    improvement: improvement > 0 ? `+${improvement}%` : `${improvement}%`,
                    lastSubmission: studentData.lastSubmission,
                    hasQuizData: true
                };
            } else {
                // Student has no quiz data
                return {
                    _id: student._id,
                    name: student.name,
                    username: student.name,
                    grade: student.grade,
                    email: student.email,
                    scores: [],
                    quizzes: [],
                    totalQuizzes: 0,
                    averageScore: 0,
                    improvement: '0%',
                    lastSubmission: null,
                    hasQuizData: false
                };
            }
        });

        // Sort by average score for ranking (students with no data go to bottom)
        comprehensiveStudentList.sort((a, b) => {
            if (a.hasQuizData && !b.hasQuizData) return -1;
            if (!a.hasQuizData && b.hasQuizData) return 1;
            return b.averageScore - a.averageScore;
        });

        // Add ranking
        comprehensiveStudentList.forEach((student, index) => {
            student.rank = index + 1;
        });

        // Calculate class statistics
        const totalStudents = comprehensiveStudentList.length;
        const activeStudents = comprehensiveStudentList.filter(s => s.hasQuizData).length;
        const studentsWithScores = comprehensiveStudentList.filter(s => s.averageScore > 0);
        const classAverage = studentsWithScores.length > 0
            ? Math.round(studentsWithScores.reduce((sum, s) => sum + s.averageScore, 0) / studentsWithScores.length)
            : 0;

        const studentsWithImprovement = comprehensiveStudentList.filter(s => s.hasQuizData);
        const overallImprovement = studentsWithImprovement.length > 0
            ? Math.round(studentsWithImprovement.reduce((sum, s) => sum + parseInt(s.improvement.replace('%', '')), 0) / studentsWithImprovement.length)
            : 0;

        res.json({
            success: true,
            data: {
                classStats: {
                    totalStudents,
                    activeStudents,
                    inactiveStudents: totalStudents - activeStudents,
                    classAverage,
                    overallImprovement: overallImprovement > 0 ? `+${overallImprovement}%` : `${overallImprovement}%`,
                    participationRate: totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 100) : 0
                },
                allStudents: comprehensiveStudentList,
                topStudents: comprehensiveStudentList.filter(s => s.hasQuizData).slice(0, 10), // Top 10 students with quiz data
                inactiveStudents: comprehensiveStudentList.filter(s => !s.hasQuizData) // Students who haven't taken any quizzes
            }
        });

    } catch (error) {
        console.error('Error fetching progress reports:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router; 
