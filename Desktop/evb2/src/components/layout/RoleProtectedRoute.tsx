import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

interface RoleProtectedRouteProps {
  allowedRoles: ('author' | 'reviewer' | 'admin' | 'viewer')[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null; // Parent layout spinner handles it
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
export default RoleProtectedRoute;
