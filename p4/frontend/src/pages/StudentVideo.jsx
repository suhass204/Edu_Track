import React, { useState, useEffect } from 'react';
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
  PlayCircle
} from 'lucide-react';

const StudentVideo = () => {
  const [activeSection] = useState('videos');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [studentData, setStudentData] = useState(null);
  
  // Original functionality
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [videos, setVideos] = useState([]);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: FileText, label: 'Quizzes/Assignments' },
    { id: 'chatbot', icon: MessageCircle, label: 'AI Chatbot' },
    { id: 'videos', icon: Play, label: 'Video Recommendations' },
    { id: 'progress', icon: BarChart3, label: 'Progress Tracker' },
    { id: 'resources', icon: BookOpen, label: 'Notes/Resources' }
  ];

  const fetchVideos = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/student/videos?grade=${grade}&subject=${subject}`);
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      alert("Failed to fetch videos");
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
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
              <h1 className="text-2xl font-bold text-gray-800">Video Recommendations</h1>
              <p className="text-gray-600">Watch educational videos curated for you!</p>
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
            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 text-xl">Find Videos by Grade & Subject</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  placeholder="Enter Grade" 
                  value={grade} 
                  onChange={e => setGrade(e.target.value)} 
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input 
                  placeholder="Enter Subject" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  onClick={fetchVideos} 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Load Videos
                </button>
              </div>
            </div>

            {/* Videos Grid */}
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {videos.map(video => {
                  const embedUrl = getYouTubeEmbedUrl(video.url);
                  return (
                    <div key={video._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                      <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-4">
                        <h3 className="font-bold text-white text-lg">{video.title}</h3>
                      </div>
                      
                      {embedUrl && (
                        <div className="relative" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={embedUrl}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <p className="text-gray-600 mb-3">{video.description}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            <span className="font-medium">Watch Now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-600">No Videos Yet</h3>
                  <p className="text-gray-500">Enter your grade and subject to load videos.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentVideo;