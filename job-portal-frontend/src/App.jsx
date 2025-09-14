import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './components/pages/LandingPage';
import AuthPage from './components/pages/AuthPage';
import { ToastContainer } from "react-toastify";
import RecruiterDashboard from './components/dashboard/recruiter/RecruiterDashboard';
// Note: CandidateDashboard is not used for now to simplify the logic.
// You can add it back with a proper role system.

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/auth"
          element={token ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/dashboard/*"
          element={
            token ? (
              // For now, we default to the RecruiterDashboard.
              // A real-world app would check user.role here.
              <RecruiterDashboard />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;