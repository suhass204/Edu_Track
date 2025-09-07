// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// const TeacherLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);

//   const login = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/teacher-login', {
//         username,
//         password,
//       });

//       if (res.data.success) {
//         alert('Teacher login successful');
//         //login('teacher');
//         // Navigate to teacher dashboard or next page if needed
//         navigate('/teacher-dashboard');
//       } else {
//         alert('Invalid credentials');
//       }
//     } catch (error) {
//       alert('Login failed');
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h2>Teacher Login</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       /><br />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       /><br />
//       <button onClick={login}>Login</button>
//     </div>
//   );
// };

// export default TeacherLogin;


import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  BookOpen,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  PlusCircle,
  ClipboardList,
  BarChart3,
  Users,
  BookMarked,
  CheckCircle
} from 'lucide-react';
import img2 from '../assets/img2.png';

const TeacherLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/api/teacher-login', {
        username,
        password,
      });

      if (res.data.success) {
        login('teacher', res.data.teacher);
        if (res.data.teacher && res.data.teacher._id) {
          localStorage.setItem('teacherId', res.data.teacher._id);
          localStorage.setItem('teacherName', res.data.teacher.name || '');
        }
        navigate('/teacher-dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Half - Image/Visual Content */}
      <div
  className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative overflow-hidden"
  style={{ backgroundImage: `url(${img2})` }}
>
  </div>

      {/* Right Half - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg lg:hidden">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 lg:hidden">EduTrack</h1>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full">
          {/* Login Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-2xl w-fit mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Teacher Login</h2>
            <p className="text-gray-600">Access your teaching dashboard and manage students</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCheck className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Additional Options
          <div className="mt-8 text-center">
            <div className="text-gray-600 mb-4">Don't have an account?</div>
            <div className="space-y-2">
              <Link 
                to="/teacher-signup" 
                className="block w-full border border-green-500 text-green-600 py-3 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Create Teacher Account
              </Link>
            </div>
          </div> */}

          {/* Alternative Logins */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-600 mb-4">Or login as</div>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/student" 
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4 text-blue-600" />
                Student
              </Link>
              <Link 
                to="/admin" 
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Admin
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">200+</div>
              <div className="text-sm text-gray-600">Active Teachers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-emerald-600">10K+</div>
              <div className="text-sm text-gray-600">Quizzes Created</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-teal-600">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;