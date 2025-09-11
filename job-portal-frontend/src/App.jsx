import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/pages/LandingPage';
import AuthPage from './components/pages/AuthPage';
import RecruiterDashboard from './components/dashboard/recruiter/RecruiterDashboard';
import CandidateDashboard from './components/dashboard/candidate/CandidateDashboard';
import ToastContainer from './components/ui/ToastContainer';
import { parseJwt } from './utils/helpers';

const App = () => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        try {
            const savedAuth = localStorage.getItem('auth');
            if (savedAuth) {
                const parsedAuth = JSON.parse(savedAuth);
                const decodedToken = parseJwt(parsedAuth.token);
                if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
                    setAuth(parsedAuth);
                } else {
                    localStorage.removeItem('auth');
                }
            }
        } catch (error) {
            console.error("Could not parse saved auth data", error);
            localStorage.removeItem('auth');
        }
        setLoading(false);
    }, []);

    const handleSetAuth = (authData) => {
        localStorage.setItem('auth', JSON.stringify(authData));
        setAuth(authData);
    };

    const handleLogout = () => {
        localStorage.removeItem('auth');
        setAuth(null);
    };

    const addToast = (toast) => {
        const id = Date.now();
        setToasts(prev => [...prev, { ...toast, id }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <>
            <ToastContainer toasts={toasts} />
            <Routes>
                <Route
                    path="/"
                    element={!auth ? <LandingPage /> : <Navigate to="/dashboard" />}
                />
                <Route
                    path="/auth"
                    element={!auth ? <AuthPage setAuth={handleSetAuth} /> : <Navigate to="/dashboard" />}
                />
                <Route
                    path="/dashboard"
                    element={auth ? (
                        auth.user.role === 'Admin' || auth.user.role === 'SuperAdmin' ? (
                            <RecruiterDashboard auth={auth} onLogout={handleLogout} addToast={addToast} />
                        ) : (
                            <CandidateDashboard auth={auth} onLogout={handleLogout} addToast={addToast} />
                        )
                    ) : <Navigate to="/auth" />}
                />
                <Route path="*" element={<Navigate to={auth ? "/dashboard" : "/"} />} />
            </Routes>
        </>
    );
};

export default App;
