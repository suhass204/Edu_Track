import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Welcome to the Educational Platform</h1>
    <Link to="/admin">Admin Login</Link><br />
    <Link to="/teacher">Teacher Login</Link><br />
    <Link to="/student">Student Login</Link>
  </div>
);

export default Home;
