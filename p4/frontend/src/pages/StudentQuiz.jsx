import React, { useEffect, useState } from 'react';

const StudentQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [studentId, setStudentId] = useState('');

  useEffect(() => {
    const storedId = localStorage.getItem('studentId');
    if (storedId) {
      setStudentId(storedId);
    }
  }, []);

  const fetchQuizzesByGrade = async (grade) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/grade/${grade}`);
      const data = await response.json();
      if (data.success) setQuizzes(data.quizzes);
    } catch (err) {
      console.error('Error fetching quizzes by grade:', err);
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
      selectedAnswer: studentAnswers[qIndex]
    }));

    try {
      const response = await fetch(`http://localhost:5000/api/quiz/${selectedQuiz._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          answers,
          timeTaken: 120 // Example static time, or you can use a timer
        })
      });

      const result = await response.json();
      if (result.success) {
        alert(`Quiz submitted! Score: ${result.score}%`);
        setSelectedQuiz(null);
      } else {
        alert(`Submission failed: ${result.error}`);
      }
    } catch (err) {
      alert('Error submitting quiz');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student Quizzes</h2>

      {/* Grade Dropdown */}
      <select value={selectedGrade} onChange={handleGradeChange} className="border p-2 rounded mb-4">
        <option value="">Select Grade</option>
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i + 1}>Grade {i + 1}</option>
        ))}
      </select>

      {/* Quiz List */}
      {!selectedQuiz ? (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="border p-4 rounded shadow">
              <h3 className="font-bold text-lg">{quiz.title}</h3>
              <p>Subject: {quiz.subject}</p>
              <p>Deadline: {new Date(quiz.deadline).toLocaleString()}</p>

              {quiz.mode === 'test' ? (
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                >
                  Start Test
                </button>
              ) : (
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
                >
                  Practice Mode
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">{selectedQuiz.title}</h3>
          {selectedQuiz.questions.map((q, i) => (
            <div key={i} className="mb-4">
              <p className="font-medium">{i + 1}. {q.question}</p>
              {q.options.map((opt, j) => (
                <label key={j} className="block ml-4">
                  <input
                    type="radio"
                    name={`q${i}`}
                    value={j}
                    checked={studentAnswers[i] === j}
                    onChange={() => handleOptionChange(i, j)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentQuiz;
