import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Protected({ children }) {
  const { isLogged } = useAuth();
  const location = useLocation();
  if (!isLogged) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

