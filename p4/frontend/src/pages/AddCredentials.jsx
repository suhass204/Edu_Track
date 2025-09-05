import React, { useState } from 'react';
import axios from 'axios';

const AddCredentials = () => {
  const [type, setType] = useState('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const add = async () => {
    const endpoint = type === 'teacher' ? 'add-teacher' : 'add-student';
    await axios.post(`http://localhost:5000/api/${endpoint}`, { username, password });
    alert(`${type} added`);
  };

  return (
    <div>
      <h2>Add {type}</h2>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
      </select><br />
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={add}>Add</button>
    </div>
  );
};

export default AddCredentials;
