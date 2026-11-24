import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ROUTES } from '../utils/constants';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen message="Verifying admin credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.ADMIN.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
