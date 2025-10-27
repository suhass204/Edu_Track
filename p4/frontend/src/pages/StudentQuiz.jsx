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
  Clock,
  CheckCircle
} from 'lucide-react';

const StudentQuizDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('quizzes');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [studentId, setStudentId] = useState('');
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

  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    if (storedId) {
      setStudentId(storedId);
    }
    fetchStudentData();
  }, []);

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

  const fetchQuizzesByGrade = async (grade) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/quiz/grade/${grade}`);
      const data = await response.json();
      if (data.success) setQuizzes(data.quizzes);
    } catch (err) {
      console.error('Error fetching quizzes by grade:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);
    setSelectedQuiz(null);
    fetchQuizzesByGrade(grade);
  };

  const handleStartQuiz = async (quiz) => {
    try {
      if (!studentId) {
        alert('Please log in as a student first.');
        return;
      }
      // Fetch quiz without correct answers and ensure attempt eligibility
      const res = await fetch(`http://localhost:5000/api/quiz/${quiz._id}?studentId=${studentId}`);
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Unable to start quiz');
        return;
      }
      setSelectedQuiz(data.quiz);
      setStudentAnswers({});
    } catch (e) {
      alert('Failed to start quiz');
    }
  };

  const handleOptionChange = (qIndex, selected) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [qIndex]: selected
    }));
  };

  const handleSubmit = async () => {
  const answers = Object.keys(studentAnswers).map((qIndex) => ({
    questionIndex: Number(qIndex),
    selectedAnswer: studentAnswers[qIndex],
  }));

  try {
    const response = await fetch(
      `http://localhost:5000/api/quiz/${selectedQuiz._id}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          quizId: selectedQuiz._id,
          answers,
          timeTaken: 120, // Example static time
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      alert(`Quiz submitted! Score: ${result.score}%`);

      // ✅ Step 2: Trigger Gemini progress analysis
      const quizResults = selectedQuiz.questions.map((q, idx) => {
        const studentAnswer = answers.find(a => a.questionIndex === idx);
        return {
          question: q.question,
          options: q.options,
          correctAnswer: q.options[q.correctAnswer],
          studentAnswer: studentAnswer
            ? q.options[studentAnswer.selectedAnswer]
            : "Not Answered",
        };
      });

      const analyzeRes = await fetch("http://localhost:5000/api/progress/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, quizResults, score: result.score}),
      });

      const analyzeData = await analyzeRes.json();
      if (analyzeData.success) {
        console.log("Adaptive analysis:", analyzeData.analysis);
        alert("Progress analysis completed successfully!");
      } else {
        console.error("Error analyzing progress:", analyzeData.error);
      }

      setSelectedQuiz(null);
    } else {
      alert(`Submission failed: ${result.error}`);
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting quiz");
  }
};


  const handleNavigation = (itemId) => {
    if (itemId === 'dashboard') {
      // In a real app, this would navigate to dashboard
      // For now, just show a message or redirect logic
      navigate("/student-dashboard");
    } else if (itemId === 'quizzes') {
      // Stay on current page
      setActiveSection('quizzes');
    } else if(itemId === 'videos') {
      // For other sections, set the active section
      navigate('/studentVideos');
    }else{
      setActiveSection(itemId);
    }
  };

  const renderQuizContent = () => {
    if (!selectedQuiz) {
      return (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl">
            <h2 className="text-2xl font-bold mb-2">Student Quizzes 🎯</h2>
            <p className="opacity-90">Select your grade to view available quizzes and assignments</p>
          </div>

          {/* Grade Dropdown */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4">Select Grade Level</h3>
            <select 
              value={selectedGrade} 
              onChange={handleGradeChange} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose your grade...</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>Grade {i + 1}</option>
              ))}
            </select>
          </div>

          {/* Quiz List */}
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-gray-500">Loading quizzes...</div>
            </div>
          ) : quizzes.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">Available Quizzes</h3>
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-2">{quiz.title}</h3>
                      <p className="text-gray-600 mb-1">Subject: {quiz.subject}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          Deadline: {new Date(quiz.deadline).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {quiz.mode === 'test' ? (
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Start Test
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartQuiz(quiz)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Practice Mode
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedGrade && (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-gray-500 mb-2">No quizzes available for Grade {selectedGrade}</div>
              <p className="text-sm text-gray-400">Check back later for new assignments</p>
            </div>
          )}
        </div>
      );
    }

    // Quiz Taking Interface
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedQuiz.title}</h2>
              <p className="opacity-90">Answer all questions and submit when ready</p>
            </div>
            <button
              onClick={() => setSelectedQuiz(null)}
              className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
            >
              Back to Quizzes
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="space-y-6">
            {selectedQuiz.questions.map((q, i) => (
              <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0">
                <p className="font-bold text-gray-800 mb-4 text-lg">
                  {i + 1}. {q.question}
                </p>
                <div className="space-y-3">
                  {q.options.map((opt, j) => (
                    <label 
                      key={j} 
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        studentAnswers[i] === j
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${i}`}
                        value={j}
                        checked={studentAnswers[i] === j}
                        onChange={() => handleOptionChange(i, j)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        studentAnswers[i] === j
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {studentAnswers[i] === j && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-lg font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'quizzes': 
        return renderQuizContent();
      case 'chatbot':
        navigate('/studentChatbot');
        break;
      case 'videos':
          navigate('/studentVideos');
          break;
      case 'progress':
        navigate('/studentprogress');
        break;
      case 'resources':
        navigate('/studentNotes');
        break;
      default: 
        return renderQuizContent();
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default StudentQuizDashboard;