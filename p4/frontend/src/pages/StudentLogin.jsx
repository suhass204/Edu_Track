import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const StudentLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/student-login', {
        username,
        password,
      });

      if (res.data.success) {
        alert('Student login successful');
        login('student', res.data.student); // Set role and user in AuthContext
        // Persist studentId for API calls
        if (res.data.student && res.data.student._id) {
          localStorage.setItem('studentId', res.data.student._id);
          localStorage.setItem('studentName', res.data.student.name || '');
        }
        navigate('/student-dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Login</h2>
      <div>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '8px', margin: '5px' }}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px', margin: '5px' }}
        />
      </div>
      <button onClick={handleLogin} style={{ padding: '10px 20px', marginTop: '10px' }}>
        Login
      </button>
    </div>
  );
};

export default StudentLogin;
