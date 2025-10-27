import React, { useEffect, useState } from 'react';
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
  TrendingUp,
  TrendingDown,
  Target,
  Award
} from 'lucide-react';

const StudentReportAnalysis = () => {
    const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('progress');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: FileText, label: 'Quizzes/Assignments' },
    { id: 'chatbot', icon: MessageCircle, label: 'AI Chatbot' },
    { id: 'videos', icon: Play, label: 'Video Recommendations' },
    { id: 'progress', icon: BarChart3, label: 'Progress Tracker' },
    { id: 'resources', icon: BookOpen, label: 'Notes/Resources' }
  ];

  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    if (storedId) {
      setStudentId(storedId);
    }
    fetchStudentData();
  }, []);

  useEffect(() => {
    if (!studentId) return;
    const fetchReports = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/progress/${studentId}`);
        const data = await res.json();
        if (data.success) setReports(data.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [studentId]);

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

  const handleNavigation = (itemId) => {
    if (itemId === 'dashboard') {
      navigate("/student-dashboard");
    } else if (itemId === 'quizzes') {
      navigate("quizzes");
    } else if(itemId === 'videos') {
      navigate('/studentVideos');
    } else if(itemId === 'chatbot') {
      navigate("studentChatbot");
    } else if(itemId === 'resources') {
      navigate('/studentNotes');   
    } else {
      setActiveSection(itemId);
    }
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading reports...</div>
        </div>
      );
    }

    if (reports.length === 0) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-2">No reports available yet</div>
          <p className="text-sm text-gray-400">Complete quizzes to see your progress analysis</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reports.map((r, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Quiz Report #{i + 1}</h3>
                  <p className="text-sm text-gray-500">
                    Generated on {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{r.score}%</div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>

            {/* Confidence Level */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700">Confidence Level</span>
                <span className="font-bold text-purple-600">{r.analysis.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                  style={{ width: `${r.analysis.confidence}%` }}
                ></div>
              </div>
            </div>

            {/* Summary */}
            {r.analysis.summary && (
              <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-semibold text-gray-800 mb-2">Summary</p>
                <p className="text-gray-700">{r.analysis.summary}</p>
              </div>
            )}

            {/* Strengths */}
            {r.analysis.strengths && r.analysis.strengths.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <p className="font-semibold text-gray-800">Strengths</p>
                </div>
                <ul className="space-y-2">
                  {r.analysis.strengths.map((s, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {r.analysis.weaknesses && r.analysis.weaknesses.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-5 h-5 text-orange-500" />
                  <p className="font-semibold text-gray-800">Areas for Improvement</p>
                </div>
                <ul className="space-y-2">
                  {r.analysis.weaknesses.map((w, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Path */}
            {r.analysis.recommendedPath && r.analysis.recommendedPath.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <p className="font-semibold text-gray-800">Recommended Learning Path</p>
                </div>
                <ul className="space-y-2">
                  {r.analysis.recommendedPath.map((p, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-700">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {j + 1}
                      </div>
                      <span className="pt-0.5">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
              onClick={() => handleNavigation(item.id)}
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
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-2">Progress Analysis 📊</h2>
              <p className="opacity-90">View your detailed performance reports and learning insights</p>
            </div>

            {renderReportContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentReportAnalysis;