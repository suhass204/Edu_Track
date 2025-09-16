import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  UserPlus,
  User,
  Lock,
  Mail,
  GraduationCap,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Users,
  UserCheck,
  Database,
  Shield
} from 'lucide-react';
import img3 from '../assets/img3.png';

const AddCredentials = () => {
  const [type, setType] = useState('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('10');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const add = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password || !name || !email) {
      setError('Please fill in all required fields');
      return;
    }

    if (type === 'student' && !grade) {
      setError('Please select a grade for the student');
      return;
    }

    try {
      setIsLoading(true);
      const endpoint = type === 'teacher' ? 'add-teacher' : 'add-student';
      const payload = type === 'teacher'
        ? { username, password, name, email }
        : { username, password, name, email, grade: parseInt(grade) };

      await axios.post(`http://localhost:5000/api/${endpoint}`, payload);
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);

      // Reset form
      setUsername('');
      setPassword('');
      setName('');
      setEmail('');
      setGrade('10');
    } catch (error) {
      console.error('Error adding user:', error);
      setError(`Error adding ${type}: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Half - Image/Visual Content */}
      <div
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: `url(${img3})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-indigo-600/80"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-8">
          <div className="bg-white/20 p-6 rounded-2xl backdrop-blur-sm mb-8">
            <UserPlus className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Add New User</h2>
          <p className="text-lg opacity-90 text-center">
            Create new teacher or student accounts to expand your educational platform
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm opacity-80">Teachers</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm opacity-80">Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg lg:hidden">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 lg:hidden">EduTrack</h1>
          </div>
          <Link
            to="/admin/add"
            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Admin</span>
          </Link>
        </div>

        <div className="max-w-md mx-auto w-full">
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-2xl w-fit mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New User</h2>
            <p className="text-gray-600">Create a new teacher or student account</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={add} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">User Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('teacher')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${type === 'teacher'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setType('student')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${type === 'student'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  Student
                </button>
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
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
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
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

            {/* Full Name Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Grade Selection (for students) */}
            {type === 'student' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Grade Level</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all appearance-none bg-white"
                    disabled={isLoading}
                  >
                    <option value="1">Grade 1</option>
                    <option value="2">Grade 2</option>
                    <option value="3">Grade 3</option>
                    <option value="4">Grade 4</option>
                    <option value="5">Grade 5</option>
                    <option value="6">Grade 6</option>
                    <option value="7">Grade 7</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding {type}...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-center text-gray-600 mb-4">Quick Actions</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setType('teacher');
                  setUsername('');
                  setPassword('');
                  setName('');
                  setEmail('');
                  setGrade('10');
                  setError('');
                  setSuccess('');
                }}
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-green-600" />
                New Teacher
              </button>
              <button
                onClick={() => {
                  setType('student');
                  setUsername('');
                  setPassword('');
                  setName('');
                  setEmail('');
                  setGrade('10');
                  setError('');
                  setSuccess('');
                }}
                className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-4 h-4 text-blue-600" />
                New Student
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">200+</div>
              <div className="text-sm text-gray-600">Teachers</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-indigo-600">500+</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-violet-600">99%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCredentials;
