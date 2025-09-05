const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Teacher = require('./models/Teacher');
const Student = require('./models/Student');
const Quiz = require('./models/Quiz');

dotenv.config();

const setupData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        // Clear existing data
        await Teacher.deleteMany({});
        await Student.deleteMany({});
        await Quiz.deleteMany({});

        // Create sample teacher
        const teacher = new Teacher({
            username: 'teacher1',
            password: 'password123',
            name: 'Ms. Sharma',
            email: 'ms.sharma@school.edu',
            subjects: ['Mathematics', 'Science'],
            profilePic: 'https://i.pravatar.cc/40?img=5'
        });
        await teacher.save();
        console.log('Created teacher:', teacher.name);

        // Create sample students
        const students = [
            {
                username: 'student1',
                password: 'password123',
                name: 'Alex Johnson',
                email: 'alex.johnson@school.edu',
                grade: 'Grade 10',
                subjects: ['Mathematics', 'Science', 'English'],
                profilePic: 'https://i.pravatar.cc/40?img=1'
            },
            {
                username: 'student2',
                password: 'password123',
                name: 'Sarah Wilson',
                email: 'sarah.wilson@school.edu',
                grade: 'Grade 10',
                subjects: ['Mathematics', 'Science', 'History'],
                profilePic: 'https://i.pravatar.cc/40?img=2'
            },
            {
                username: 'student3',
                password: 'password123',
                name: 'Mike Chen',
                email: 'mike.chen@school.edu',
                grade: 'Grade 9',
                subjects: ['Mathematics', 'Science'],
                profilePic: 'https://i.pravatar.cc/40?img=3'
            }
        ];

        const savedStudents = [];
        for (const studentData of students) {
            const student = new Student(studentData);
            await student.save();
            savedStudents.push(student);
            console.log('Created student:', student.name);
        }

        // Create sample quizzes
        const quizzes = [
            {
                title: 'Algebra Basics',
                subject: 'Mathematics',
                grade: 'Grade 10',
                mode: 'test',
                duration: 30,
                numberOfQuestions: 5,
                teacherId: teacher._id,
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                questions: [
                    {
                        question: 'What is the value of x in the equation 2x + 5 = 13?',
                        options: ['3', '4', '5', '6'],
                        correctAnswer: 1,
                        points: 1
                    },
                    {
                        question: 'Simplify: 3x + 2x - 5x',
                        options: ['0', 'x', '5x', '10x'],
                        correctAnswer: 0,
                        points: 1
                    },
                    {
                        question: 'Solve for y: 2y - 8 = 4',
                        options: ['2', '4', '6', '8'],
                        correctAnswer: 2,
                        points: 1
                    },
                    {
                        question: 'What is the slope of the line y = 3x + 2?',
                        options: ['2', '3', '5', '6'],
                        correctAnswer: 1,
                        points: 1
                    },
                    {
                        question: 'Factor: x² - 4',
                        options: ['(x-2)(x+2)', '(x-2)(x-2)', '(x+2)(x+2)', '(x-4)(x+1)'],
                        correctAnswer: 0,
                        points: 1
                    }
                ]
            },
            {
                title: 'Chemical Reactions',
                subject: 'Science',
                grade: 'Grade 9',
                mode: 'test',
                duration: 25,
                numberOfQuestions: 4,
                teacherId: teacher._id,
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                questions: [
                    {
                        question: 'What type of reaction is: 2H₂ + O₂ → 2H₂O?',
                        options: ['Synthesis', 'Decomposition', 'Single replacement', 'Double replacement'],
                        correctAnswer: 0,
                        points: 1
                    },
                    {
                        question: 'What is the chemical symbol for gold?',
                        options: ['Ag', 'Au', 'Fe', 'Cu'],
                        correctAnswer: 1,
                        points: 1
                    },
                    {
                        question: 'Which gas is produced during photosynthesis?',
                        options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
                        correctAnswer: 1,
                        points: 1
                    },
                    {
                        question: 'What is the pH of a neutral solution?',
                        options: ['0', '7', '14', '10'],
                        correctAnswer: 1,
                        points: 1
                    }
                ]
            },
            {
                title: 'World War II Overview',
                subject: 'History',
                grade: 'Grade 11',
                mode: 'practice',
                duration: 20,
                numberOfQuestions: 3,
                teacherId: teacher._id,
                deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
                questions: [
                    {
                        question: 'In which year did World War II end?',
                        options: ['1943', '1944', '1945', '1946'],
                        correctAnswer: 2,
                        points: 1
                    },
                    {
                        question: 'Which country was NOT part of the Axis Powers?',
                        options: ['Germany', 'Italy', 'Japan', 'France'],
                        correctAnswer: 3,
                        points: 1
                    },
                    {
                        question: 'What was the code name for the Allied invasion of Normandy?',
                        options: ['Operation Overlord', 'Operation Barbarossa', 'Operation Market Garden', 'Operation Torch'],
                        correctAnswer: 0,
                        points: 1
                    }
                ]
            }
        ];

        for (const quizData of quizzes) {
            const quiz = new Quiz(quizData);
            await quiz.save();
            console.log('Created quiz:', quiz.title);
        }

        console.log('\n✅ Sample data setup completed successfully!');
        console.log('\n📋 Sample Credentials:');
        console.log('Teacher: username=teacher1, password=password123');
        console.log('Student: username=student1, password=password123');
        console.log('Student: username=student2, password=password123');
        console.log('Student: username=student3, password=password123');

        process.exit(0);
    } catch (error) {
        console.error('Error setting up data:', error);
        process.exit(1);
    }
};

setupData();
