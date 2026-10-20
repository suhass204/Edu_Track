import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// Rehydrate from localStorage on load so a page refresh or direct link to a
// protected route doesn't silently bounce an already-logged-in user to Home.
const initialAuth = () => {
  if (localStorage.getItem('teacherId')) {
    return { userType: 'teacher', user: { _id: localStorage.getItem('teacherId'), name: localStorage.getItem('teacherName') } };
  }
  if (localStorage.getItem('studentId')) {
    return { userType: 'student', user: { _id: localStorage.getItem('studentId'), name: localStorage.getItem('studentName') } };
  }
  return { userType: null, user: null };
};

const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(() => initialAuth().userType); // 'teacher' or 'student'
  const [user, setUser] = useState(() => initialAuth().user);

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
