import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './components/pages/LandingPage';
import AuthPage from './components/pages/AuthPage';
import { ToastContainer } from "react-toastify";
import RecruiterDashboard from './components/dashboard/recruiter/RecruiterDashboard';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { isTokenValid } from './utils/auth';

function App() {
  const { token } = useSelector((state) => state.auth);
  const validToken = isTokenValid(token);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
       <Route path="/auth" element={<AuthPage />} />


        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
