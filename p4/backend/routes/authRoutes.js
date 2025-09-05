const express = require('express');
const router = express.Router();

const Admin = require('../models/Admin');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

// Initial admin setup (run once)
router.post('/setup-admin', async (req, res) => {
    const { username, password } = req.body;
    const existing = await Admin.findOne({ username });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    const admin = new Admin({ username, password });
    await admin.save();
    res.json({ msg: "Admin created" });
});

// Admin Login
router.post('/admin-login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });
    if (admin) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

// Add Teacher
router.post('/add-teacher', async (req, res) => {
    try {
        const { username, password, name, email, subjects } = req.body;

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ $or: [{ username }, { email }] });
        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                error: 'Teacher with this username or email already exists'
            });
        }

        const teacher = new Teacher({
            username,
            password,
            name: name || 'Teacher',
            email: email || `${username}@school.edu`,
            subjects: subjects || ['Mathematics']
        });

        await teacher.save();
        res.json({
            success: true,
            message: "Teacher added successfully",
            teacher: {
                _id: teacher._id,
                username: teacher.username,
                name: teacher.name,
                email: teacher.email,
                subjects: teacher.subjects
            }
        });
    } catch (error) {
        console.error('Error adding teacher:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Add Student
router.post('/add-student', async (req, res) => {
    try {
        const { username, password, name, email, grade, subjects } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ $or: [{ username }, { email }] });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                error: 'Student with this username or email already exists'
            });
        }

        const normalizedGrade = typeof grade === 'number'
            ? grade
            : parseInt(String(grade || '').replace(/[^0-9]/g, ''), 10) || 10;
        const student = new Student({
            username,
            password,
            name: name || 'Student',
            email: email || `${username}@school.edu`,
            grade: normalizedGrade,
            subjects: subjects || ['Mathematics', 'Science']
        });

        await student.save();
        res.json({
            success: true,
            message: "Student added successfully",
            student: {
                _id: student._id,
                username: student.username,
                name: student.name,
                email: student.email,
                grade: student.grade,
                subjects: student.subjects
            }
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Teacher Login
router.post('/teacher-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const teacher = await Teacher.findOne({ username, password });
        if (teacher) {
            res.json({
                success: true,
                teacher: {
                    _id: teacher._id,
                    username: teacher.username,
                    name: teacher.name,
                    email: teacher.email,
                    subjects: teacher.subjects
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in teacher login:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Student Login
router.post('/student-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const student = await Student.findOne({ username, password });
        if (student) {
            res.json({
                success: true,
                student: {
                    _id: student._id,
                    username: student.username,
                    name: student.name,
                    email: student.email,
                    grade: student.grade,
                    subjects: student.subjects
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in student login:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get teacher by ID
router.get('/user/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await Teacher.findById(teacherId);
        if (teacher) {
            res.json({
                success: true,
                teacher: {
                    _id: teacher._id,
                    username: teacher.username,
                    name: teacher.name,
                    email: teacher.email,
                    subjects: teacher.subjects
                }
            });
        } else {
            res.status(404).json({ success: false, error: 'Teacher not found' });
        }
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get student by ID
router.get('/user/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId);
        if (student) {
            res.json({
                success: true,
                student: {
                    _id: student._id,
                    username: student.username,
                    name: student.name,
                    email: student.email,
                    grade: student.grade,
                    subjects: student.subjects
                }
            });
        } else {
            res.status(404).json({ success: false, error: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;





// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const User = require('./models/User');

// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB error", err));

// app.post('/api/admin-login', async (req, res) => {
//   const { username, password } = req.body;
//   const admin = await User.findOne({ username, password, role: 'admin' });
//   if (admin) {
//     res.json({ success: true });
//   } else {
//     res.json({ success: false, message: "Invalid Admin Credentials" });
//   }
// });

// app.post('/api/add-teacher', async (req, res) => {
//   const { username, password } = req.body;
//   const teacher = new User({ username, password, role: 'teacher' });
//   await teacher.save();
//   res.json({ success: true, message: "Teacher added" });
// });

// app.post('/api/add-student', async (req, res) => {
//   const { username, password } = req.body;
//   const student = new User({ username, password, role: 'student' });
//   await student.save();
//   res.json({ success: true, message: "Student added" });
// });

// app.post('/api/teacher-login', async (req, res) => {
//   const { username, password } = req.body;
//   const teacher = await User.findOne({ username, password, role: 'teacher' });
//   if (teacher) {
//     res.json({ success: true });
//   } else {
//     res.json({ success: false });
//   }
// });

// app.post('/api/student-login', async (req, res) => {
//   const { username, password } = req.body;
//   const student = await User.findOne({ username, password, role: 'student' });
//   if (student) {
//     res.json({ success: true });
//   } else {
//     res.json({ success: false });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

