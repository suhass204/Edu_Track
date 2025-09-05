import React, { useState } from 'react';
import axios from 'axios';

const AddCredentials = () => {
  const [type, setType] = useState('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('10');

  const add = async () => {
    try {
      const endpoint = type === 'teacher' ? 'add-teacher' : 'add-student';
      const payload = type === 'teacher'
        ? { username, password, name, email }
        : { username, password, name, email, grade: parseInt(grade) };

      await axios.post(`http://localhost:5000/api/${endpoint}`, payload);
      alert(`${type} added successfully`);

      // Reset form
      setUsername('');
      setPassword('');
      setName('');
      setEmail('');
      setGrade('10');
    } catch (error) {
      console.error('Error adding user:', error);
      alert(`Error adding ${type}: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Add {type}</h2>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      >
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select><br />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      {type === 'student' && (
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
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
      )}

      <button
        onClick={add}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add {type}
      </button>
    </div>
  );
};

export default AddCredentials;
