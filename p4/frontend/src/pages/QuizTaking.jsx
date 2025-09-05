import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

const QuizTaking = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const studentId = localStorage.getItem('studentId') || '507f1f77bcf86cd799439012'; // Default student ID
      const response = await fetch(`http://localhost:5000/api/quiz/${quizId}?studentId=${studentId}`);
      const data = await response.json();
      
      if (data.success) {
        setQuiz(data.quiz);
        setTimeLeft(data.quiz.duration * 60); // Convert minutes to seconds
        setLoading(false);
      } else {
        setError(data.error);
        setLoading(false);
      }
    } catch (error) {
      setError('Failed to load quiz');
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedAnswer
    }));
  };

  const handleSubmit = async () => {
    try {
      const studentId = localStorage.getItem('studentId') || '507f1f77bcf86cd799439012';
      const answersArray = Object.keys(answers).map(questionIndex => ({
        questionIndex: parseInt(questionIndex),
        selectedAnswer: answers[questionIndex]
      }));

      const response = await fetch(`http://localhost:5000/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          answers: answersArray,
          timeTaken: quiz.duration * 60 - timeLeft // Time taken in seconds
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
        // Show results
        alert(`Quiz submitted! Your score: ${data.score}%`);
        navigate('/student-dashboard');
      } else {
        alert('Error submitting quiz: ' + data.error);
      }
    } catch (error) {
      alert('Error submitting quiz: ' + error.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Quiz not found</h2>
          <button 
            onClick={() => navigate('/student-dashboard')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/student-dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.subject} • {quiz.grade}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="font-bold text-red-600">{formatTime(timeLeft)}</span>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-lg text-gray-700 mb-6">{currentQ.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit Quiz
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Question Navigation</h3>
          <div className="grid grid-cols-5 gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`p-3 rounded-lg text-sm font-medium ${
                  currentQuestion === index
                    ? 'bg-blue-500 text-white'
                    : answers[index] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTaking;
