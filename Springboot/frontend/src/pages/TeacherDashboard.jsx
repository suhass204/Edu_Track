import React, { useState, useEffect, useMemo } from 'react';
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
  Send,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Users,
  Award,
  AlertCircle,
  Eye,
  Filter,
  Search,
  FileUp,
  Video,
  FileText as FileTextIcon,
  PieChart,
  Activity,
  Mail,
  BookMarked,
  RefreshCw
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hello! I\'m your AI teaching assistant. How can I help you today?' }
  ]);
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [quizForm, setQuizForm] = useState({
    title: '',
    subject: '',
    grade: '',
    deadline: '',
    mode: 'test',
    duration: 30
  });
  const [questions, setQuestions] = useState([
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 0,
      points: 1
    }
  ]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [teacherData, setTeacherData] = useState(null);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [selectedQuizResults, setSelectedQuizResults] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedStudentSubmission, setSelectedStudentSubmission] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', subjects: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [notificationPrefs, setNotificationPrefs] = useState({
    'New student submissions': true,
    'Quiz deadline reminders': true,
    'Student messages': true,
    'System updates': true
  });

  const teacherId = localStorage.getItem('teacherId');

  useEffect(() => {
    if (!teacherId) {
      navigate('/teacher');
    }
  }, [teacherId, navigate]);

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: FileText, label: 'Create & Manage Quizzes' },
    { id: 'submissions', icon: BookMarked, label: 'Submissions / Grading' },
    { id: 'videos', icon: Video, label: 'Upload Video Lessons' },
    { id: 'notes', icon: FileTextIcon, label: 'Upload Notes / Resources' },
    { id: 'reports', icon: BarChart3, label: 'Student Progress Reports' },
    { id: 'chat', icon: MessageCircle, label: 'Chat with Students (AI)' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages,
      { type: 'user', message: chatInput },
      { type: 'bot', message: 'Thank you for your message! I\'ll help you with your teaching needs.' }
      ]);
      setChatInput('');
    }
  };

  const handleCreateQuiz = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quizForm,
          grade: parseInt(quizForm.grade, 10),
          questions: questions,
          numberOfQuestions: questions.length,
          teacherId
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Quiz created successfully!');
        setShowQuizForm(false);
        setQuizForm({
          title: '',
          subject: '',
          grade: '',
          deadline: '',
          mode: 'test',
          duration: 30,
          numberOfQuestions: 10
        });
        setQuestions([]);
        // Refresh quizzes list
        fetchQuizzes();
      } else {
        alert('Error creating quiz: ' + data.error);
      }
    } catch (error) {
      alert('Error creating quiz: ' + error.message);
    }
  };

  const startEditQuiz = (quiz) => {
    setEditingQuizId(quiz._id);
    setShowQuizForm(true);
    setQuizForm({
      title: quiz.title || '',
      subject: quiz.subject || '',
      grade: String(quiz.grade ?? ''),
      deadline: quiz.deadline ? new Date(quiz.deadline).toISOString().slice(0, 16) : '',
      mode: quiz.mode || 'test',
      duration: quiz.duration || 30
    });
    setQuestions((quiz.questions || []).map(q => ({
      question: q.question || '',
      options: q.options || ['', '', '', ''],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      points: typeof q.points === 'number' ? q.points : 1
    })));
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuizId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${editingQuizId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quizForm,
          grade: parseInt(quizForm.grade, 10),
          questions: questions,
          numberOfQuestions: questions.length
        })
      });
      const data = await response.json();
      if (data.success) {
        alert('Quiz updated successfully!');
        setEditingQuizId(null);
        setShowQuizForm(false);
        setQuizForm({ title: '', subject: '', grade: '', deadline: '', mode: 'test', duration: 30 });
        setQuestions([]);
        fetchQuizzes();
      } else {
        alert('Error updating quiz: ' + data.error);
      }
    } catch (error) {
      alert('Error updating quiz: ' + error.message);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const confirmed = window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.');
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        alert('Quiz deleted successfully');
        fetchQuizzes();
      } else {
        alert('Error deleting quiz: ' + data.error);
      }
    } catch (error) {
      alert('Error deleting quiz: ' + error.message);
    }
  };

  const fetchQuizzes = async () => {
    if (!teacherId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/teacher/${teacherId}`);
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchQuizResults = async (quizId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/results`);
      const data = await response.json();
      if (data.success) {
        setSelectedQuizResults(data.quiz);
        setShowSubmissionModal(true);
      }
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const viewStudentSubmission = async (quizId, studentSubmission) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/results`);
      const data = await response.json();
      if (data.success) {
        setSelectedQuizResults(data.quiz);
        setSelectedStudentSubmission(studentSubmission);
        setShowSubmissionModal(true);
      }
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const fetchProgressData = async (grade = 'All Classes') => {
    if (!teacherId) return;
    try {
      setLoadingProgress(true);
      const url = grade === 'All Classes'
        ? `${API_BASE_URL}/api/quiz/teacher/${teacherId}/progress`
        : `${API_BASE_URL}/api/quiz/teacher/${teacherId}/progress?grade=${grade}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setProgressData(data.data);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoadingProgress(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === 'options') {
      updatedQuestions[index].options = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const fetchTeacherData = async () => {
    if (!teacherId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/teacher/${teacherId}`);
      const data = await response.json();
      if (data.success) {
        setTeacherData(data.teacher);
        setProfileForm({
          name: data.teacher.name || '',
          subjects: (data.teacher.subjects || []).join(', ')
        });
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  // Fetch quizzes and teacher data on component mount
  useEffect(() => {
    fetchQuizzes();
    fetchTeacherData();
    fetchProgressData();
  }, []);

  // Fetch progress data when selected class changes
  useEffect(() => {
    if (activeSection === 'reports') {
      fetchProgressData(selectedClass);
    }
  }, [selectedClass, activeSection]);

  const handleSaveProfile = async () => {
    if (!teacherId) return;
    setProfileSaving(true);
    setProfileMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/teacher/${teacherId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name,
          subjects: profileForm.subjects.split(',').map(s => s.trim()).filter(Boolean)
        })
      });
      const data = await response.json();
      if (data.success) {
        setTeacherData(data.teacher);
        localStorage.setItem('teacherName', data.teacher.name || '');
        setProfileMessage('Profile updated successfully.');
      } else {
        setProfileMessage('Failed to update profile: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      setProfileMessage('Failed to update profile: ' + error.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const timeAgo = (dateString) => {
    if (!dateString) return '';
    const diffMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  // Live dashboard stats derived from quizzes/progress already fetched - no fake numbers.
  const totalQuizzes = quizzes.length;
  const totalSubmissions = quizzes.reduce((sum, q) => sum + (q.submissions?.length || 0), 0);
  const totalStudents = progressData?.classStats?.totalStudents ?? null;
  const classAverage = progressData?.classStats?.classAverage ?? null;
  const recentSubmissionsCount = quizzes.reduce((sum, q) => {
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return sum + (q.submissions || []).filter(s => new Date(s.submittedAt).getTime() >= dayAgo).length;
  }, 0);

  // Backend submissions only store the student's email id (no populated name/grade), so
  // resolve display info from the progress data we already fetch.
  const studentLookup = useMemo(() => {
    const map = {};
    (progressData?.allStudents || []).forEach(s => { map[s._id] = s; });
    return map;
  }, [progressData]);
  const studentDisplayName = (studentId) => studentLookup[studentId]?.name || studentId || 'Student';
  const studentDisplayGrade = (studentId) => studentLookup[studentId]?.grade ?? '';

  // Flatten per-student quiz history (already resolved with names) into a recent-activity feed.
  const recentActivity = (progressData?.allStudents || [])
    .flatMap(student => (student.quizzes || []).map(q => ({
      action: `${student.name} submitted "${q.title}" — ${q.score}%`,
      time: q.submittedAt,
      type: 'submission'
    })))
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-7 px-4 rounded-lg font-medium">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {(teacherData && teacherData.name) || localStorage.getItem('teacherName') || 'Teacher'}! 🎓</h2>
        <p className="opacity-90">Ready to inspire your students today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm font-medium">Active</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{totalQuizzes} Quiz{totalQuizzes !== 1 ? 'zes' : ''}</h3>
          <p className="text-sm text-gray-600">Created by you</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <BookMarked className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm font-medium">{recentSubmissionsCount > 0 ? 'New' : 'None'}</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{totalSubmissions} Submission{totalSubmissions !== 1 ? 's' : ''}</h3>
          <p className="text-sm text-gray-600">{recentSubmissionsCount} in the last 24h</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">Active</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{totalStudents ?? '—'} Students</h3>
          <p className="text-sm text-gray-600">In your selected classes</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm font-medium">Average</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">{classAverage !== null ? `${classAverage}%` : '—'}</h3>
          <p className="text-sm text-gray-600">Class average score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Latest Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500">No student activity yet.</p>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-800">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{timeAgo(activity.time)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6" />
            <div>
              <h3 className="font-bold">Teaching Tip of the Day</h3>
              <p className="opacity-90">"Give feedback quickly to boost learning! Students who receive feedback within 24 hours show 40% better retention."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuizzes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Create & Manage Quizzes</h2>
        <button
          onClick={() => setShowQuizForm(!showQuizForm)}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-500"
        >
          <Plus className="w-4 h-4" />
          {showQuizForm ? 'Cancel' : 'Create New Quiz'}
        </button>
      </div>

      {showQuizForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4">Create New Quiz</h3>

          {/* Basic Quiz Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              placeholder="Quiz Title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.title}
              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
            />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.subject}
              onChange={(e) => setQuizForm({ ...quizForm, subject: e.target.value })}
            >
              <option value="">Select Subject</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.grade}
              onChange={(e) => setQuizForm({ ...quizForm, grade: e.target.value })}
            >
              <option value="">Select Grade</option>
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
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.mode}
              onChange={(e) => setQuizForm({ ...quizForm, mode: e.target.value })}
            >
              <option value="test">Test Mode</option>
              <option value="practice">Practice Mode</option>
            </select>
            <input
              type="number"
              placeholder="Duration (minutes)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.duration}
              onChange={(e) => setQuizForm({ ...quizForm, duration: parseInt(e.target.value) })}
              min="5"
              max="180"
            />
            <input
              type="datetime-local"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.deadline}
              onChange={(e) => setQuizForm({ ...quizForm, deadline: e.target.value })}
            />
          </div>

          {/* Questions Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">Questions</h4>
              <button
                onClick={addQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {questions.map((question, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-800">Question {index + 1}</h5>
                  <button
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter your question"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  {question.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[optionIndex] = e.target.value;
                        updateQuestion(index, 'options', newOptions);
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={question.correctAnswer}
                    onChange={(e) => updateQuestion(index, 'correctAnswer', parseInt(e.target.value))}
                  >
                    <option value={0}>Option 1 is correct</option>
                    <option value={1}>Option 2 is correct</option>
                    <option value={2}>Option 3 is correct</option>
                    <option value={3}>Option 4 is correct</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Points"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
                    value={question.points}
                    onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {editingQuizId ? (
              <button
                onClick={handleUpdateQuiz}
                disabled={!quizForm.title || !quizForm.subject || !quizForm.grade || questions.length === 0}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Update Quiz
              </button>
            ) : (
              <button
                onClick={handleCreateQuiz}
                disabled={!quizForm.title || !quizForm.subject || !quizForm.grade || questions.length === 0}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Create Quiz
              </button>
            )}
            <button
              onClick={() => { setShowQuizForm(false); setEditingQuizId(null); }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quiz List */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Your Quizzes</h3>
          <button
            onClick={fetchQuizzes}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No quizzes created yet. Create your first quiz!</p>
            </div>
          ) : (
            quizzes.map((quiz, index) => {
              const isExpired = new Date(quiz.deadline) < new Date();
              const status = isExpired ? 'expired' : 'active';
              const avgScore = quiz.submissions.length > 0
                ? (quiz.submissions.reduce((sum, sub) => sum + sub.score, 0) / quiz.submissions.length).toFixed(1)
                : 0;

              return (
                <div key={quiz._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800">{quiz.title}</h4>
                      <p className="text-gray-600">{quiz.subject} • {quiz.grade}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-500">{quiz.submissions.length} submissions</span>
                        <span className="text-gray-500">{quiz.duration} min</span>
                        {avgScore > 0 && <span className="text-green-600">Avg: {avgScore}%</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-100 text-green-800' :
                        status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <button onClick={() => fetchQuizResults(quiz._id)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="View submissions">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => startEditQuiz(quiz)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteQuiz(quiz._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Submissions & Grading</h2>
        <button onClick={fetchQuizzes} className="text-blue-600 hover:text-blue-800 text-sm">Refresh</button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {quizzes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No quizzes yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="border border-gray-200 rounded-lg">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800">{quiz.title}</h4>
                    <p className="text-gray-600">Grade {quiz.grade} • {quiz.subject}</p>
                  </div>
                  <div className="text-sm text-gray-600">{quiz.submissions.length} submissions</div>
                </div>
                {quiz.submissions.length === 0 ? (
                  <div className="px-4 pb-4 text-sm text-gray-500">No submissions yet.</div>
                ) : (
                  <div className="divide-y">
                    {quiz.submissions.map((sub, idx) => (
                      <div key={idx} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{studentDisplayName(sub.studentId)}</div>
                          <div className="text-sm text-gray-500">Submitted {new Date(sub.submittedAt).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-green-600 font-semibold">{sub.score}%</span>
                          <button onClick={() => viewStudentSubmission(quiz._id, sub)} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 text-sm">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  // Rendered once at the top level (not tied to any single tab) so the Eye/View-details
  // button works from both the Quizzes and Submissions tabs.
  const renderSubmissionModal = () => (
    showSubmissionModal && selectedQuizResults && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-xl shadow-xl">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">
                {selectedQuizResults.title} — {selectedStudentSubmission ? `${studentDisplayName(selectedStudentSubmission.studentId)} Details` : 'All Submissions'}
              </h3>
              <p className="text-sm text-gray-600">Grade {selectedQuizResults.grade} • {selectedQuizResults.subject}</p>
            </div>
            <button onClick={() => { setShowSubmissionModal(false); setSelectedQuizResults(null); setSelectedStudentSubmission(null); }} className="text-gray-600 hover:text-gray-800">Close</button>
          </div>
          <div className="p-4 space-y-6">
            {selectedStudentSubmission ? (
              // Show specific student's submission
              <div className="border border-gray-200 rounded-lg">
                <div className="p-4 flex items-center justify-between bg-gray-50">
                  <div>
                    <div className="font-semibold text-gray-800">{studentDisplayName(selectedStudentSubmission.studentId)} — Grade {studentDisplayGrade(selectedStudentSubmission.studentId)}</div>
                    <div className="text-sm text-gray-500">Submitted {new Date(selectedStudentSubmission.submittedAt).toLocaleString()} • Time Taken: {selectedStudentSubmission.timeTaken ?? '-'} min</div>
                  </div>
                  <div className="text-blue-600 font-bold">Score: {selectedStudentSubmission.score}%</div>
                </div>
                <div className="p-4 space-y-3">
                  {selectedQuizResults.questions.map((q, qIdx) => {
                    const answer = selectedStudentSubmission.answers.find(a => a.questionIndex === qIdx);
                    const isCorrect = answer ? answer.isCorrect : false;
                    return (
                      <div key={qIdx} className={`p-3 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="font-medium text-gray-800">Q{qIdx + 1}. {q.question}</div>
                        <div className="mt-1 text-sm">
                          <div className="text-gray-700">Correct Answer: <span className="font-semibold">{q.options[q.correctAnswer]}</span></div>
                          <div className="text-gray-700">Student Answer: <span className="font-semibold">{answer ? q.options[answer.selectedAnswer] : '—'}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // Show all submissions (fallback)
              selectedQuizResults.submissions.length === 0 ? (
                <div className="text-gray-500">No submissions.</div>
              ) : (
                selectedQuizResults.submissions.map((sub, sIdx) => (
                  <div key={sIdx} className="border border-gray-200 rounded-lg">
                    <div className="p-4 flex items-center justify-between bg-gray-50">
                      <div>
                        <div className="font-semibold text-gray-800">{studentDisplayName(sub.studentId)} — Grade {studentDisplayGrade(sub.studentId)}</div>
                        <div className="text-sm text-gray-500">Submitted {new Date(sub.submittedAt).toLocaleString()} • Time Taken: {sub.timeTaken ?? '-'} min</div>
                      </div>
                      <div className="text-blue-600 font-bold">Score: {sub.score}%</div>
                    </div>
                    <div className="p-4 space-y-3">
                      {selectedQuizResults.questions.map((q, qIdx) => {
                        const answer = sub.answers.find(a => a.questionIndex === qIdx);
                        const isCorrect = answer ? answer.isCorrect : false;
                        return (
                          <div key={qIdx} className={`p-3 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                            <div className="font-medium text-gray-800">Q{qIdx + 1}. {q.question}</div>
                            <div className="mt-1 text-sm">
                              <div className="text-gray-700">Correct Answer: <span className="font-semibold">{q.options[q.correctAnswer]}</span></div>
                              <div className="text-gray-700">Student Answer: <span className="font-semibold">{answer ? q.options[answer.selectedAnswer] : '—'}</span></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    )
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Student Progress Reports</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Select Grade:</label>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="All Classes">All Classes</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>
          <button
            onClick={() => fetchProgressData(selectedClass)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-green-400 text-sm flex items-center gap-2"
            disabled={loadingProgress}
          >
            <RefreshCw className={`w-4 h-4 ${loadingProgress ? 'animate-spin' : ''}`} />
            {loadingProgress ? 'Loading...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {loadingProgress ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading progress data...</div>
        </div>
      ) : progressData ? (
        <>
          {/* Class Overview Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Class Overview - {selectedClass}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Total Students</div>
                <div className="text-2xl font-bold text-blue-600">{progressData.classStats.totalStudents}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Active Students</div>
                <div className="text-2xl font-bold text-green-600">{progressData.classStats.activeStudents}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-600 mb-1">Participation Rate</div>
                <div className="text-2xl font-bold text-purple-600">
                  {progressData.classStats.totalStudents > 0
                    ? Math.round((progressData.classStats.activeStudents / progressData.classStats.totalStudents) * 100)
                    : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Overall Class Performance Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Overall Class Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Class Average Score</h4>
                    <p className="text-3xl font-bold text-green-600">{progressData.classStats.classAverage}%</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Based on {progressData.topStudents.reduce((sum, s) => sum + s.totalQuizzes, 0)} quiz submissions
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Overall Improvement</h4>
                    <p className="text-3xl font-bold text-purple-600">{progressData.classStats.overallImprovement}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Average improvement across all students
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Students Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              Top Performing Students - {selectedClass}
            </h3>
            {progressData.topStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No student data available for the selected class.</p>
                <p className="text-sm mt-2">Create quizzes and have students submit them to see progress reports.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressData.topStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{student.name}</div>
                        <div className="text-sm text-gray-500">Grade {student.grade} • {student.totalQuizzes} quiz{student.totalQuizzes !== 1 ? 'es' : ''} taken</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Improvement</div>
                        <div className={`font-semibold ${parseInt(student.improvement.replace('%', '')) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {student.improvement}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Average Score</div>
                        <div className="text-xl font-bold text-gray-800">{student.averageScore}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Students Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              All Students - {selectedClass}
            </h3>
            {progressData.allStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No students found for the selected class.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {progressData.allStudents.map((student, index) => (
                  <div key={student._id} className={`flex items-center justify-between p-4 rounded-lg transition-colors ${student.hasQuizData ? 'bg-gray-50 hover:bg-gray-100' : 'bg-red-50 hover:bg-red-100'
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${!student.hasQuizData ? 'bg-red-500' :
                        student.rank === 1 ? 'bg-yellow-500' :
                          student.rank === 2 ? 'bg-gray-400' :
                            student.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                        {student.hasQuizData ? student.rank : '!'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{student.name}</div>
                        <div className="text-sm text-gray-500">
                          Grade {student.grade} • {student.username}
                          {student.hasQuizData ? ` • ${student.totalQuizzes} quiz${student.totalQuizzes !== 1 ? 'es' : ''} taken` : ' • No quizzes taken'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {student.hasQuizData ? (
                        <>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Quizzes Taken</div>
                            <div className="text-lg font-bold text-blue-600">{student.totalQuizzes}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Average Score</div>
                            <div className="text-xl font-bold text-gray-800">{student.averageScore}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500">Improvement</div>
                            <div className={`font-semibold ${parseInt(student.improvement.replace('%', '')) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {student.improvement}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="text-sm text-red-500">No Quiz Data</div>
                          <div className="text-sm text-gray-500">Encourage participation</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inactive Students Section */}
          {progressData.inactiveStudents && progressData.inactiveStudents.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                Students Needing Attention - {selectedClass}
              </h3>
              <div className="space-y-3">
                {progressData.inactiveStudents.map((student, index) => (
                  <div key={student._id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                        !
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{student.name}</div>
                        <div className="text-sm text-gray-500">Grade {student.grade} • {student.username} • No quizzes taken</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-red-500">No Participation</div>
                      <div className="text-sm text-gray-500">Encourage engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No progress data available. Create some quizzes and have students submit them to see progress reports.</p>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-800 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email (login id, not editable)</label>
            <input type="email" value={teacherData?.email || ''} disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Taught (comma separated)</label>
            <input
              type="text"
              value={profileForm.subjects}
              onChange={(e) => setProfileForm({ ...profileForm, subjects: e.target.value })}
              placeholder="e.g. Mathematics, Science"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {profileMessage && (
          <p className={`mt-3 text-sm ${profileMessage.startsWith('Failed') ? 'text-red-600' : 'text-green-600'}`}>{profileMessage}</p>
        )}
        <button
          onClick={handleSaveProfile}
          disabled={profileSaving}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {profileSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-800 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {Object.keys(notificationPrefs).map((pref) => (
            <div key={pref} className="flex items-center justify-between">
              <span className="text-gray-700">{pref}</span>
              <input
                type="checkbox"
                checked={notificationPrefs[pref]}
                onChange={() => setNotificationPrefs(prev => ({ ...prev, [pref]: !prev[pref] }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">These preferences are stored locally on this device only.</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'quizzes': return renderQuizzes();
      case 'submissions': return renderSubmissions();
      case 'videos': navigate('/teacherVideos');break;
      case 'notes': navigate('/teacherNotes');break;
      case 'reports':navigate('/teacherProgress');break;
      case 'chat':navigate('/teacherChatbot');break;
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
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
                {recentSubmissionsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{recentSubmissionsCount}</span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">{(teacherData && teacherData.name) || localStorage.getItem('teacherName') || 'Teacher'}</p>
                    <p className="text-sm text-gray-600">{teacherData?.subjects ? teacherData.subjects.join(', ') : 'Teacher'}</p>
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
          {renderSubmissionModal()}
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;