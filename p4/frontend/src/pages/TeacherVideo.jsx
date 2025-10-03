import React, { useState } from 'react';
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
  CheckCircle
} from 'lucide-react';

const TeacherVideo = () => {
  const [activeSection] = useState('videos');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    grade: '',
    subject: '',
    addedBy: ''
  });

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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.url || !formData.description || !formData.grade || !formData.subject || !formData.addedBy) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/teacher/add-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert("Video added!");
        setFormData({ title: '', description: '', url: '', grade: '', subject: '', addedBy: '' });
      } else {
        alert("Failed to add video");
      }
    } catch (err) {
      alert("Failed to add video");
    }
  };

  const handleClear = () => {
    setFormData({ title: '', description: '', url: '', grade: '', subject: '', addedBy: '' });
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
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === item.id
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
              <h2 className="text-2xl font-bold mb-2">Upload Video Lessons 🎥</h2>
              <p className="opacity-90">Share educational content with your students</p>
            </div>

            {/* Add Video Form */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Upload className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-xl">Add New Video</h3>
                  <p className="text-sm text-gray-600">Fill in the details to upload a video lesson</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      placeholder="e.g., Introduction to Algebra"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="Brief description of what students will learn..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="grade"
                      placeholder="e.g., 10"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="subject"
                      placeholder="e.g., Mathematics"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="addedBy"
                      placeholder="Your name"
                      value={formData.addedBy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-green-600 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Add Video
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
                  <h3 className="font-bold">Video Upload Tips</h3>
                  <p className="opacity-90">Make sure your YouTube video is set to public or unlisted for students to access it!</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherVideo;