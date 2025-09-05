import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  PlayCircle,
  Star,
  Send
} from 'lucide-react';

const EduTrackDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hi! I\'m your AI study assistant. How can I help you today?' }
  ]);
  const [quizzes, setQuizzes] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: FileText, label: 'Quizzes/Assignments' },
    { id: 'chatbot', icon: MessageCircle, label: 'AI Chatbot' },
    { id: 'videos', icon: Play, label: 'Video Recommendations' },
    { id: 'progress', icon: BarChart3, label: 'Progress Tracker' },
    { id: 'resources', icon: BookOpen, label: 'Notes/Resources' }
  ];

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages,
      { type: 'user', message: chatInput },
      { type: 'bot', message: 'Thanks for your question! I\'m processing your request and will help you understand this concept better.' }
      ]);
      setChatInput('');
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        console.error('No studentId in localStorage. Redirecting to login.');
        navigate('/student-login');
        return;
      }
      const response = await fetch(`http://localhost:5000/api/quiz/student/${studentId}`);
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.quizzes);
      } else {
        console.error('Error fetching quizzes:', data.error);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const fetchStudentData = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) return;
      const response = await fetch(`http://localhost:5000/api/user/student/${studentId}`);
      const data = await response.json();
      if (data.success) {
        setStudentData(data.student);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    fetchStudentData();
    if (activeSection === 'quizzes') {
      fetchQuizzes();
    }
  }, [activeSection]);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {(studentData && studentData.name) || localStorage.getItem('studentName') || 'Student'}! 🎯</h2>
        <p className="opacity-90">Ready to continue your learning journey?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm font-medium">Due Tomorrow</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Science Quiz</h3>
          <p className="text-sm text-gray-600">Chemistry: Acids & Bases</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">Recommended</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Algebra Basics</h3>
          <p className="text-sm text-gray-600">15 min • Mathematics</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm font-medium">Progress</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">65% Complete</h3>
          <p className="text-sm text-gray-600">Quiz Performance</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-2xl">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Tip of the Day</h3>
            <p className="opacity-90">"Practice daily for 30 minutes to improve retention by 40%!"</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuizzes = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Quizzes & Assignments</h2>

      <div className="grid gap-4">
        {[
          { subject: 'Science', topic: 'Acids & Bases', deadline: 'Tomorrow', status: 'pending', color: 'orange' },
          { subject: 'Mathematics', topic: 'Quadratic Equations', deadline: '3 days', status: 'pending', color: 'green' },
          { subject: 'History', topic: 'World War II', deadline: 'Completed', status: 'completed', color: 'purple' },
          { subject: 'English', topic: 'Shakespeare Analysis', deadline: '1 week', status: 'pending', color: 'pink' }
        ].map((quiz, index) => (
          <div key={index} className={`bg-white p-6 rounded-xl shadow-lg border border-${quiz.color}-100`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{quiz.subject}</h3>
                <p className="text-gray-600">{quiz.topic}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Due: {quiz.deadline}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {quiz.status === 'completed' ? (
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    View Results
                  </button>
                ) : (
                  <>
                    <button className={`bg-${quiz.color}-500 text-white px-4 py-2 rounded-lg hover:bg-${quiz.color}-600`}>
                      Start Quiz
                    </button>
                    <button className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50">
                      Practice Mode
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-800 mb-4">Leaderboard 🏆</h3>
        <div className="space-y-3">
          {[
            { name: 'Sarah Johnson', score: 95, rank: 1 },
            { name: 'You (Alex)', score: 87, rank: 2 },
            { name: 'Mike Chen', score: 82, rank: 3 }
          ].map((student, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-bold text-purple-600">#{student.rank}</span>
                <span className={student.name.includes('You') ? 'font-bold text-purple-600' : 'text-gray-800'}>
                  {student.name}
                </span>
              </div>
              <span className="font-bold text-green-600">{student.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChatbot = () => (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Study Assistant</h2>

      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.type === 'user'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-800'
                }`}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything about your studies..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          'Explain photosynthesis',
          'Help with algebra',
          'Study tips for exams',
          'Career guidance'
        ].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setChatInput(suggestion)}
            className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Video Recommendations</h2>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>All Subjects</option>
          <option>Mathematics</option>
          <option>Science</option>
          <option>History</option>
          <option>English</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Algebra Basics', subject: 'Mathematics', duration: '15 min', watched: false, thumbnail: '🔢' },
          { title: 'Photosynthesis Explained', subject: 'Science', duration: '12 min', watched: true, thumbnail: '🌱' },
          { title: 'World War II Overview', subject: 'History', duration: '20 min', watched: false, thumbnail: '🌍' },
          { title: 'Shakespeare\'s Techniques', subject: 'English', duration: '18 min', watched: false, thumbnail: '📚' },
          { title: 'Chemical Reactions', subject: 'Science', duration: '14 min', watched: true, thumbnail: '⚗️' },
          { title: 'Geometry Fundamentals', subject: 'Mathematics', duration: '16 min', watched: false, thumbnail: '📐' }
        ].map((video, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 h-40 flex items-center justify-center text-4xl">
              {video.thumbnail}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{video.subject}</span>
                <span>{video.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${video.watched
                  ? 'bg-green-100 text-green-600'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}>
                  <PlayCircle className="w-4 h-4" />
                  {video.watched ? 'Watched' : 'Watch'}
                </button>
                {video.watched && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Progress Tracker</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Quiz Average</h3>
              <p className="text-2xl font-bold text-green-600">87%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <PlayCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Videos Watched</h3>
              <p className="text-2xl font-bold text-purple-600">24/30</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Improvement</h3>
              <p className="text-2xl font-bold text-orange-600">+12%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-800 mb-4">Subject Performance</h3>
        <div className="space-y-4">
          {[
            { subject: 'Mathematics', score: 92, color: 'green' },
            { subject: 'Science', score: 85, color: 'orange' },
            { subject: 'English', score: 88, color: 'purple' },
            { subject: 'History', score: 79, color: 'pink' }
          ].map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{subject.subject}</span>
                <span className="font-bold text-gray-800">{subject.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-${subject.color}-500 h-2 rounded-full`}
                  style={{ width: `${subject.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Strengths 💪</h3>
          <div className="space-y-2">
            <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg">Problem Solving</div>
            <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg">Mathematical Reasoning</div>
            <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg">Critical Analysis</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Areas to Improve 📈</h3>
          <div className="space-y-2">
            <div className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg">Historical Dates</div>
            <div className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg">Grammar Rules</div>
            <div className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg">Chemical Formulas</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'quizzes': return renderQuizzes();
      case 'chatbot': return renderChatbot();
      case 'videos': return renderVideos();
      case 'progress': return renderProgress();
      case 'resources': return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600">Coming Soon!</h3>
            <p className="text-gray-500">Notes & Resources feature will be available soon.</p>
          </div>
        </div>
      );
      default: return renderDashboard();
    }
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
              onClick={() => {
                if (item.id === 'quizzes') {
                  navigate('/quizzes');
                } else {
                  setActiveSection(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === item.id
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
              <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
              <p className="text-gray-600">Track your progress and stay motivated!</p>
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
                    <p className="font-medium text-gray-800">{(studentData && studentData.name) || localStorage.getItem('studentName') || 'Student'}</p>
                    <p className="text-sm text-gray-600">{studentData?.grade ? `Grade ${studentData.grade}` : 'Grade'}</p>
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EduTrackDashboard;