# EduTrack - Complete Quiz Management System

A comprehensive educational platform with quiz creation, management, and taking capabilities for teachers and students.

## 🚀 Features

### For Teachers:
- **Dashboard Overview**: Quick stats and activity feed
- **Quiz Creation**: Create quizzes with multiple choice questions
- **Quiz Management**: Edit, delete, and view quiz performance
- **Submissions & Grading**: View and grade student submissions
- **Student Progress Reports**: Track individual and class performance
- **AI Chat Assistant**: Get teaching tips and assistance
- **Resource Management**: Upload videos and study materials

### For Students:
- **Dashboard**: Personalized learning overview
- **Available Quizzes**: View and take quizzes based on grade level
- **Quiz Taking**: Interactive quiz interface with timer
- **Progress Tracking**: Monitor performance and improvements
- **AI Study Assistant**: Get help with questions and concepts

## 🛠 Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Icons**: Lucide React
- **Routing**: React Router

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd EduTrack
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Create Environment File
Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/edutrack
PORT=5000
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Set Up Sample Data
```bash
cd ../backend
node setupData.js
```

This will create:
- 1 teacher account
- 3 student accounts
- 3 sample quizzes

### 6. Start the Application

**Start Backend:**
```bash
cd backend
npm start
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

## 👥 Sample Credentials

### Teacher Account:
- **Username**: `teacher1`
- **Password**: `password123`
- **Name**: Ms. Sharma
- **Subjects**: Mathematics, Science

### Student Accounts:
- **Student 1**: `student1` / `password123` (Grade 10)
- **Student 2**: `student2` / `password123` (Grade 10)
- **Student 3**: `student3` / `password123` (Grade 9)

## 📚 How to Use

### For Teachers:

1. **Login** with teacher credentials
2. **Create Quizzes**:
   - Go to "Create & Manage Quizzes"
   - Click "Create New Quiz"
   - Fill in quiz details (title, subject, grade, duration, deadline)
   - Add questions with multiple choice options
   - Set correct answers and points
   - Publish the quiz

3. **Monitor Submissions**:
   - View student submissions in "Submissions / Grading"
   - See automatic grading results
   - Export results if needed

4. **Track Progress**:
   - Check "Student Progress Reports" for performance analytics
   - View individual student scores and class averages

### For Students:

1. **Login** with student credentials
2. **View Available Quizzes**:
   - Go to "Quizzes/Assignments"
   - See quizzes available for your grade level
   - Check deadlines and duration

3. **Take Quizzes**:
   - Click "Start Quiz" on any available quiz
   - Answer questions within the time limit
   - Navigate between questions using the question navigation
   - Submit when finished

4. **Track Progress**:
   - View your performance in "Progress Tracker"
   - See strengths and areas for improvement

## 🔌 API Endpoints

### Authentication
- `POST /api/teacher-login` - Teacher login
- `POST /api/student-login` - Student login
- `POST /api/add-teacher` - Add new teacher
- `POST /api/add-student` - Add new student

### Quiz Management
- `POST /api/quiz/create` - Create new quiz
- `GET /api/quiz/teacher/:teacherId` - Get teacher's quizzes
- `GET /api/quiz/student/:studentId` - Get student's available quizzes
- `GET /api/quiz/:quizId` - Get specific quiz
- `POST /api/quiz/:quizId/submit` - Submit quiz answers
- `PUT /api/quiz/:quizId` - Update quiz
- `DELETE /api/quiz/:quizId` - Delete quiz
- `GET /api/quiz/:quizId/results` - Get quiz results

## 🎯 Key Features Explained

### Quiz Creation System
- Teachers can create quizzes with multiple choice questions
- Set time limits and deadlines
- Choose between test and practice modes
- Assign to specific grades
- Automatic scoring and grading

### Grade-Based Access Control
- Students only see quizzes for their grade level
- Automatic filtering prevents access to inappropriate content
- Secure quiz taking with answer validation

### Real-Time Features
- Live timer during quiz taking
- Progress tracking
- Immediate score calculation
- Activity feeds for teachers

### Modern UI/UX
- Responsive design for all devices
- Intuitive navigation
- Beautiful gradients and modern styling
- Interactive elements with hover effects

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Update environment variables
3. Deploy to Heroku, Vercel, or similar platform

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Netlify, Vercel, or similar platform
3. Update API endpoints to production URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Happy Learning! 🎓** 
