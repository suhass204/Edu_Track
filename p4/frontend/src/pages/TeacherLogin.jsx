// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// const TeacherLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);

//   const login = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/teacher-login', {
//         username,
//         password,
//       });

//       if (res.data.success) {
//         alert('Teacher login successful');
//         //login('teacher');
//         // Navigate to teacher dashboard or next page if needed
//         navigate('/teacher-dashboard');
//       } else {
//         alert('Invalid credentials');
//       }
//     } catch (error) {
//       alert('Login failed');
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h2>Teacher Login</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       /><br />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       /><br />
//       <button onClick={login}>Login</button>
//     </div>
//   );
// };

// export default TeacherLogin;


import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TeacherLogin = () => {
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
      const res = await axios.post('http://localhost:5000/api/teacher-login', {
        username,
        password,
      });

      if (res.data.success) {
        alert('Teacher login successful');
        login('teacher', res.data.teacher); // Set login type and user in AuthContext
        if (res.data.teacher && res.data.teacher._id) {
          localStorage.setItem('teacherId', res.data.teacher._id);
          localStorage.setItem('teacherName', res.data.teacher.name || '');
        }
        navigate('/teacher-dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login error. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teacher Login</h2>
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

export default TeacherLogin;
