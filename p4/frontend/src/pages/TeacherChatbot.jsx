import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Send
} from 'lucide-react';

const TeacherChatbot = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('chat');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m your AI teaching assistant. How can I help you today?' }
  ]);

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

  // 🧹 Helper to clean markdown-style text
  const cleanResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold **text**
      .replace(/```[\s\S]*?```/g, "") // remove code blocks
      .replace(/[*#>_`]/g, "") // remove markdown symbols
      .trim();
  };

  const handleChat = async () => {
    if (!query.trim()) return;

    // Add user message to chat
    const userMessage = { type: 'user', message: query };
    setChatMessages(prev => [...prev, userMessage]);

    setLoading(true);
    setResponse("");
    const currentQuery = query;
    setQuery(""); // Clear input immediately

    try {
      const res = await fetch("http://localhost:5000/api/chatbot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery, userRole: "teacher" }),
      });

      const data = await res.json();
      if (data.success) {
        const cleaned = cleanResponse(data.response);
        setResponse(cleaned);
        // Add bot response to chat
        setChatMessages(prev => [...prev, { type: 'bot', message: cleaned }]);
      } else {
        const errorMsg = "Error: Unable to fetch response";
        setResponse(errorMsg);
        setChatMessages(prev => [...prev, { type: 'bot', message: errorMsg }]);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = "Error connecting to server";
      setResponse(errorMsg);
      setChatMessages(prev => [...prev, { type: 'bot', message: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
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
              onClick={() => {
                if (item.id === 'dashboard') {
                  navigate('/teacher-dashboard');
                } else if (item.id === 'quizzes') {
                  navigate('/teacher-quizzes');
                } else if (item.id === 'submissions') {
                  navigate('/teacher-submissions');
                } else if (item.id === 'videos') {
                  navigate('/teacherVideos');
                } else if (item.id === 'resources') {
                  navigate('/teacherNotes');
                } else if (item.id === 'reports') {
                  navigate('/teacherprogress');
                }else {
                  setActiveSection(item.id);
                }
              }}
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
              <h1 className="text-2xl font-bold text-gray-800">AI Teaching Assistant</h1>
              <p className="text-gray-600">Get instant help with teaching resources and student support!</p>
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
                    <p className="font-medium text-gray-800">{localStorage.getItem('teacherName') || 'radha'}</p>
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
                      <button 
                        onClick={() => navigate('/teacher-login')}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg text-left text-red-600"
                      >
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
          <div className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
              <div className="flex-1 p-4 space-y-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.type === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {msg.message}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-100 text-gray-800">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                    placeholder="Ask me anything about teaching or student support..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={loading}
                  />
                  <button
                    onClick={handleChat}
                    className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-2 rounded-lg hover:from-teal-600 hover:to-green-600 disabled:opacity-50"
                    disabled={loading}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                'Create a quiz for Grade 10',
                'Student engagement tips',
                'Grading strategies',
                'Classroom management advice'
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 bg-gradient-to-r from-teal-100 to-green-100 text-teal-700 rounded-lg hover:from-teal-200 hover:to-green-200 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherChatbot;