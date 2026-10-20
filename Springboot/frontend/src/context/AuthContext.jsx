import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null); // 'teacher' or 'student'
  const [user, setUser] = useState(null);

  const login = (type, userPayload) => {
    setUserType(type);
    setUser(userPayload || null);

    if (type === 'student' && userPayload && userPayload._id) {
      localStorage.setItem('studentId', userPayload._id);
      localStorage.setItem('studentName', userPayload.name || '');
      localStorage.removeItem('teacherId');
    }

    if (type === 'teacher' && userPayload && userPayload._id) {
      localStorage.setItem('teacherId', userPayload._id);
      localStorage.setItem('teacherName', userPayload.name || '');
      localStorage.removeItem('studentId');
    }
  };

  const logout = () => {
    setUserType(null);
    setUser(null);
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    localStorage.removeItem('teacherId');
    localStorage.removeItem('teacherName');
  };

  return (
    <AuthContext.Provider value={{ userType, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
