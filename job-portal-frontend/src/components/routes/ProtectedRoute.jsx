import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenValid } from "../../utils/auth";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!isTokenValid(token)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
