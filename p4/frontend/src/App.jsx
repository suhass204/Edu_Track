import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import TeacherLogin from './pages/TeacherLogin';
import StudentLogin from './pages/StudentLogin';
import AddCredentials from './pages/AddCredentials';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import QuizTaking from './pages/QuizTaking';
import StudentQuiz from './pages/StudentQuiz';

import './index.css'

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/add" element={<AddCredentials />} />
        <Route path="/teacher" element={<TeacherLogin />} />
        <Route path="/student" element={<StudentLogin />} />
        <Route path="/quizzes" element={<StudentQuiz />} />
        {/* <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} /> */}
         <Route path="/teacher-dashboard" element={
            <ProtectedRoute allowedType="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedType="student">
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/quiz/:quizId" element={
            <ProtectedRoute allowedType="student">
              <QuizTaking />
            </ProtectedRoute>
          } />
      </Routes>
    </Router>
     </AuthProvider>
  );
}

export default App;
