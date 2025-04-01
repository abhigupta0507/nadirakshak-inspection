import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user's role is in the allowed roles list
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to dashboard if authenticated but not authorized
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RoleProtectedRoute;