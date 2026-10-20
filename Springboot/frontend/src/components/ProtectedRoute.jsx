import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedType }) => {
  const { userType } = useContext(AuthContext);

  if (userType === allowedType) {
    return children;
  }

  return <Navigate to="/" />;
};

export default ProtectedRoute;
