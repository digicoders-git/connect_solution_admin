// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Simple auth guard that checks for presence of auth token in localStorage.
 * If not present, redirects to /login and preserves attempted location in state.
 */
export default function RequireAuth({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
