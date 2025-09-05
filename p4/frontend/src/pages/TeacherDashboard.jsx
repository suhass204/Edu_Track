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
  BookMarked
} from 'lucide-react';

const TeacherDashboard = () => {
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

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: FileText, label: 'Create & Manage Quizzes' },
    { id: 'submissions', icon: BookMarked, label: 'Submissions / Grading' },
    { id: 'videos', icon: Video, label: 'Upload Video Lessons' },
    { id: 'notes', icon: FileTextIcon, label: 'Upload Notes / Resources' },
    { id: 'reports', icon: BarChart3, label: 'Student Progress Reports' },
    { id: 'chat', icon: MessageCircle, label: 'Chat with Students (AI)' },
    { id: 'class', icon: Users, label: 'Class Management' },
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
      const response = await fetch('http://localhost:5000/api/quiz/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...quizForm,
          questions: questions,
          numberOfQuestions: questions.length,
          teacherId: '507f1f77bcf86cd799439011' // Default teacher ID
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

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quiz/teacher/507f1f77bcf86cd799439011');
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
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
    try {
      const response = await fetch('http://localhost:5000/api/user/teacher/507f1f77bcf86cd799439011');
      const data = await response.json();
      if (data.success) {
        setTeacherData(data.teacher);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    }
  };

  // Fetch quizzes and teacher data on component mount
  useEffect(() => {
    fetchQuizzes();
    fetchTeacherData();
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Ms. Sharma! 🎓</h2>
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
          <h3 className="font-bold text-gray-800 mb-2">12 Quizzes</h3>
          <p className="text-sm text-gray-600">Created this month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <BookMarked className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-orange-600 text-sm font-medium">Pending</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">5 Submissions</h3>
          <p className="text-sm text-gray-600">Need grading</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium">Active</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">22 Students</h3>
          <p className="text-sm text-gray-600">Online today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-purple-600 text-sm font-medium">Recent</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">4 Uploads</h3>
          <p className="text-sm text-gray-600">This week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Latest Activity
          </h3>
          <div className="space-y-3">
            {[
              { action: 'Student Alex submitted Math Quiz', time: '2 min ago', type: 'submission' },
              { action: 'New message from Student Sarah', time: '15 min ago', type: 'message' },
              { action: 'Student Mike watched "Algebra Basics"', time: '1 hour ago', type: 'video' },
              { action: 'Quiz "Science Test" deadline approaching', time: '2 hours ago', type: 'reminder' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'submission' ? 'bg-green-500' :
                    activity.type === 'message' ? 'bg-blue-500' :
                    activity.type === 'video' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-gray-800">{activity.action}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
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
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
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
              onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
            />
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.subject}
              onChange={(e) => setQuizForm({...quizForm, subject: e.target.value})}
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
              onChange={(e) => setQuizForm({...quizForm, grade: e.target.value})}
            >
              <option value="">Select Grade</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.mode}
              onChange={(e) => setQuizForm({...quizForm, mode: e.target.value})}
            >
              <option value="test">Test Mode</option>
              <option value="practice">Practice Mode</option>
            </select>
            <input
              type="number"
              placeholder="Duration (minutes)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.duration}
              onChange={(e) => setQuizForm({...quizForm, duration: parseInt(e.target.value)})}
              min="5"
              max="180"
            />
            <input
              type="datetime-local"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quizForm.deadline}
              onChange={(e) => setQuizForm({...quizForm, deadline: e.target.value})}
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
            <button 
              onClick={handleCreateQuiz}
              disabled={!quizForm.title || !quizForm.subject || !quizForm.grade || questions.length === 0}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Quiz
            </button>
            <button 
              onClick={() => setShowQuizForm(false)}
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
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status === 'active' ? 'bg-green-100 text-green-800' :
                        status === 'expired' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
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
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>All Quizzes</option>
            <option>Algebra Basics</option>
            <option>Chemical Reactions</option>
            <option>World War II</option>
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
            <Download className="w-4 h-4" />
            Export Results
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="space-y-4">
          {[
            { student: 'Alex Johnson', quiz: 'Algebra Basics', submitted: '2 hours ago', score: 95, status: 'graded' },
            { student: 'Sarah Wilson', quiz: 'Chemical Reactions', submitted: '1 hour ago', score: 88, status: 'graded' },
            { student: 'Mike Chen', quiz: 'Algebra Basics', submitted: '30 min ago', score: null, status: 'pending' },
            { student: 'Emma Davis', quiz: 'World War II', submitted: '15 min ago', score: null, status: 'pending' }
          ].map((submission, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
    <div>
                  <h4 className="font-bold text-gray-800">{submission.student}</h4>
                  <p className="text-gray-600">{submission.quiz}</p>
                  <p className="text-sm text-gray-500">Submitted: {submission.submitted}</p>
                </div>
                <div className="flex items-center gap-4">
                  {submission.score !== null ? (
                    <span className="text-lg font-bold text-green-600">{submission.score}%</span>
                  ) : (
                    <span className="text-orange-600 font-medium">Pending</span>
                  )}
                  <button className={`px-4 py-2 rounded-lg ${
                    submission.status === 'graded' 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}>
                    {submission.status === 'graded' ? 'View Details' : 'Grade Now'}
                  </button>
                </div>
              </div>
      </div>
          ))}
      </div>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Upload Video Lessons</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <Upload className="w-4 h-4" />
          Upload Video
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Video Lesson</h3>
          <p className="text-gray-600 mb-4">Drag and drop your video file here, or click to browse</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Choose File
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Algebra Basics', subject: 'Mathematics', duration: '15 min', views: 45, uploaded: '2 days ago' },
          { title: 'Photosynthesis', subject: 'Science', duration: '12 min', views: 32, uploaded: '1 week ago' },
          { title: 'World War II Overview', subject: 'History', duration: '20 min', views: 28, uploaded: '3 days ago' }
        ].map((video, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-40 flex items-center justify-center">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>{video.subject}</span>
                <span>{video.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{video.views} views</span>
                <span>{video.uploaded}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Edit
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Upload Notes & Study Material</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <FileUp className="w-4 h-4" />
          Upload Resource
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Study Material</h3>
          <p className="text-gray-600 mb-4">Upload PDFs, PPTs, Docs, or other study materials</p>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Choose Files
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Algebra Notes', type: 'PDF', subject: 'Mathematics', size: '2.3 MB', uploaded: '1 day ago' },
          { title: 'Chemistry Lab Report', type: 'DOC', subject: 'Science', size: '1.8 MB', uploaded: '3 days ago' },
          { title: 'History Timeline', type: 'PPT', subject: 'History', size: '4.1 MB', uploaded: '1 week ago' }
        ].map((resource, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileTextIcon className="w-6 h-6 text-blue-600" />
              </div>
    <div>
                <h3 className="font-bold text-gray-800">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.type} • {resource.size}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{resource.subject} • {resource.uploaded}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Assign to Class
              </button>
              <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Student Progress Reports</h2>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option>All Classes</option>
          <option>Grade 9</option>
          <option>Grade 10</option>
          <option>Grade 11</option>
          <option>Grade 12</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
    <div>
              <h3 className="font-bold text-gray-800">Class Average</h3>
              <p className="text-2xl font-bold text-green-600">87%</p>
            </div>
          </div>
    </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
    <div>
              <h3 className="font-bold text-gray-800">Active Students</h3>
              <p className="text-2xl font-bold text-blue-600">22/25</p>
            </div>
          </div>
    </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
    <div>
              <h3 className="font-bold text-gray-800">Improvement</h3>
              <p className="text-2xl font-bold text-purple-600">+15%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-800 mb-4">Top Performing Students</h3>
        <div className="space-y-3">
          {[
            { name: 'Sarah Johnson', score: 95, rank: 1, improvement: '+8%' },
            { name: 'Alex Chen', score: 92, rank: 2, improvement: '+12%' },
            { name: 'Mike Wilson', score: 89, rank: 3, improvement: '+5%' },
            { name: 'Emma Davis', score: 87, rank: 4, improvement: '+10%' }
          ].map((student, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-600">#{student.rank}</span>
                <span className="font-medium text-gray-800">{student.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-green-600 font-medium">{student.improvement}</span>
                <span className="font-bold text-gray-800">{student.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Teaching Assistant</h2>
      
      <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
        <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                msg.type === 'user' 
                  ? 'bg-blue-500 text-white' 
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
              placeholder="Ask me about teaching strategies, student management..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          'Create engaging quiz questions',
          'Student motivation strategies',
          'Classroom management tips',
          'Assessment best practices'
        ].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => setChatInput(suggestion)}
            className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-all"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );

  const renderClass = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          Add New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Grade 10A', subject: 'Mathematics', students: 25, active: 22 },
          { name: 'Grade 9B', subject: 'Science', students: 28, active: 26 },
          { name: 'Grade 11C', subject: 'History', students: 20, active: 18 }
        ].map((classInfo, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">{classInfo.name}</h3>
              <span className="text-sm text-gray-500">{classInfo.subject}</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Students:</span>
                <span className="font-medium">{classInfo.students}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Today:</span>
                <span className="font-medium text-green-600">{classInfo.active}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Manage Students
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
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
            <input type="text" defaultValue="Ms. Sharma" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" defaultValue="ms.sharma@school.edu" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjects Taught</label>
            <input type="text" defaultValue="Mathematics, Science" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
    <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Save Changes
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-bold text-gray-800 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {[
            'New student submissions',
            'Quiz deadline reminders',
            'Student messages',
            'System updates'
          ].map((pref, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-700">{pref}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'quizzes': return renderQuizzes();
      case 'submissions': return renderSubmissions();
      case 'videos': return renderVideos();
      case 'notes': return renderNotes();
      case 'reports': return renderReports();
      case 'chat': return renderChat();
      case 'class': return renderClass();
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
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
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
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">Ms. Sharma</p>
                    <p className="text-sm text-gray-600">Mathematics Teacher</p>
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

export default TeacherDashboard;