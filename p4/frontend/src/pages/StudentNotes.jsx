// src/components/StudentNotes.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Home,
  FileText,
  MessageCircle,
  Play,
  BarChart3,
  BookOpen,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Download
} from 'lucide-react';

const StudentNotes = () => {
  const navigate = useNavigate();
  const [activeSection] = useState('resources');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState([]);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: FileText, label: 'Quizzes/Assignments' },
    { id: 'chatbot', icon: MessageCircle, label: 'AI Chatbot' },
    { id: 'videos', icon: Play, label: 'Video Recommendations' },
    { id: 'progress', icon: BarChart3, label: 'Progress Tracker' },
    { id: 'resources', icon: BookOpen, label: 'Notes/Resources' }
  ];

  const navigateToSection = (sectionId) => {
    switch (sectionId) {
      case 'dashboard':
        navigate('/student-dashboard');
        break;
      case 'quizzes':
        navigate('/quizzes');
        break;
      case 'videos':
        navigate('/studentVideos');
        break;
    case 'resources':
        navigate('/studentNotes');
        break;
      default:
        break;
    }
  };

  const fetchNotes = async (grade) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notes/grade/${grade}`);
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes', err);
    }
  };

  useEffect(() => {
    if (grade) {
      fetchNotes(grade);
    } else {
      setNotes([]);
    }
  }, [grade]);

  const getCleanFilename = (filename) => {
    return filename.replace(/^\d+-\d+-/, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">EduTrack</h1>
          </div>
        </div>

        <nav className="px-4 space-y-2">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigateToSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Notes/Resources</h1>
              <p className="text-gray-600">Access study materials and notes for your grade</p>
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
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Student</p>
                    <p className="text-sm text-gray-600">Grade</p>
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
            {/* Grade Selection Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 text-xl">Select Your Grade</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 col-span-2"
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                </select>
              </div>
            </div>

            {/* Notes List */}
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <div key={note._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-white" />
                        <h3 className="font-bold text-white text-lg truncate">
                          {getCleanFilename(note.filename)}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={`http://localhost:5000/uploads/${note.filename}`}
                          target="_blank"   // <-- open in new tab
                          rel="noopener noreferrer"
                          className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-200 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="font-medium">Download</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600">
                    {grade ? 'No Notes Available' : 'No Grade Selected'}
                  </h3>
                  <p className="text-gray-500">
                    {grade 
                      ? 'No notes available for this grade yet.' 
                      : 'Please select your grade to view available notes.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentNotes;
