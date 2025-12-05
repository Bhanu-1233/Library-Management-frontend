import React from "react";
import { useAuth } from "../contexts/useAuth.js";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useAuth(); // Destructure authReady from the context

  if (!authReady) {
    // Show a loading state until the auth check is complete
    return <div>Loading...</div>;
  }

  if (!user) {
    // If the user is not authenticated after the check, redirect
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the children
  return children;
};

export default ProtectedRoute;
