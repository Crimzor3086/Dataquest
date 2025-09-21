
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if this is an admin-only route
  if (adminOnly && user.email !== 'enochosenwafulah@gmail.com') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">Access Denied</h1>
            <p className="text-xl text-gray-400 mb-8">
              You don't have permission to access the admin dashboard. 
              Only authorized administrators can access this area.
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 font-semibold mb-2">Unauthorized Access Attempt</p>
              <p className="text-gray-400 text-sm">
                Email: {user.email}
              </p>
              <p className="text-gray-400 text-sm">
                Time: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
