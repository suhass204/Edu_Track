import React, { useEffect, useState } from 'react';
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
  TrendingUp,
  TrendingDown,
  Target,
  Award
} from 'lucide-react';

const TeacherProgressReport = () => {
  const [activeSection] = useState('reports');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/progress");
        const data = await res.json();
        if (data.success) setReports(data.data);
      } catch (err) {
        console.error("Error fetching all progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

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
          <div className="text-gray-500 mb-2">No student reports found</div>
          <p className="text-sm text-gray-400">Reports will appear here once students complete quizzes</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-teal-500 to-green-500">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Student</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Score</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Confidence</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Strengths</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Weaknesses</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-white">Recommended Path</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-white">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-green-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-800">
                        {r.studentId?.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-teal-100 text-teal-800">
                      {r.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${r.analysis.confidence}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {r.analysis.confidence}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {r.analysis.strengths && r.analysis.strengths.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.analysis.strengths.map((s, j) => (
                            <span key={j} className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                              <TrendingUp className="w-3 h-3" />
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {r.analysis.weaknesses && r.analysis.weaknesses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.analysis.weaknesses.map((w, j) => (
                            <span key={j} className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                              <TrendingDown className="w-3 h-3" />
                              {w}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {r.analysis.recommendedPath && r.analysis.recommendedPath.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {r.analysis.recommendedPath.map((p, j) => (
                            <span key={j} className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs">
                              <Target className="w-3 h-3" />
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
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
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Student Progress Reports 📊</h2>
                  <p className="opacity-90">Monitor your students' performance and learning journey</p>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            {renderReportContent()}

            {/* Summary Stats */}
            {reports.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Reports</p>
                      <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Score</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-3 rounded-lg">
                      <Target className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Confidence</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {Math.round(reports.reduce((sum, r) => sum + r.analysis.confidence, 0) / reports.length)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherProgressReport;