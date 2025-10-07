// src/components/TeacherNotes.js
import React, { useState } from 'react';
import axios from 'axios';
import {
  Home,
  FileText,
  ClipboardList,
  Video,
  BookOpen,
  BarChart3,
  MessageCircle,
  Users,
  Settings,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Upload,
  CheckCircle,
  File
} from 'lucide-react';

const TeacherNotes = () => {
  const [activeSection] = useState('resources');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Original functionality
  const [grade, setGrade] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: FileText, label: 'Create & Manage Quizzes' },
    { id: 'submissions', icon: ClipboardList, label: 'Submissions / Grading' },
    { id: 'videos', icon: Video, label: 'Upload Video Lessons' },
    { id: 'resources', icon: BookOpen, label: 'Upload Notes / Resources' },
    { id: 'reports', icon: BarChart3, label: 'Student Progress Reports' },
    { id: 'chat', icon: MessageCircle, label: 'Chat with Students (AI)' },
    { id: 'class', icon: Users, label: 'Class Management' }
  ];

  const handleFileDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !grade) {
      setMessage('Please select a grade and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('note', file);
    formData.append('grade', grade);

    try {
      await axios.post('http://localhost:5000/api/notes/upload', formData);
      setMessage('Note uploaded successfully.');
      setFile(null);
      setGrade('');
    } catch (err) {
      setMessage('Upload failed.');
    }
  };

  const handleClear = () => {
    setFile(null);
    setGrade('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">EduTrack Teacher</h1>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {}}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 mt-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
              <p className="text-gray-600">Manage your classes and inspire learning!</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">radha</p>
                    <p className="text-sm text-gray-600">Teacher</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left">
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <hr className="my-2" />
                      <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left text-red-600">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-2">Upload Notes & Resources 📚</h2>
              <p className="opacity-90">Share study materials with your students</p>
            </div>

            {/* Upload Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Upload className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">Upload New Resource</h3>
                  <p className="text-sm text-gray-600">Upload PDF notes or study materials for students</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Grade</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File <span className="text-red-500">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    <input
                      id="fileInput"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {file ? (
                      <div className="flex items-center justify-center gap-3">
                        <File className="w-8 h-8 text-teal-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{file.name}</p>
                          <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">Drag and drop a PDF file here</p>
                        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                      </div>
                    )}
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.includes('successfully') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleUpload}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-green-600 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Note
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
                  >
                    Clear Form
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <h3 className="font-bold">Upload Tips</h3>
                  <p className="opacity-90">Make sure your PDF files are clear and readable. Organize materials by grade for easy student access!</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherNotes;