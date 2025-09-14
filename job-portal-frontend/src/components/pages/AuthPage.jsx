import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../ui/Logo';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
// Use the new apiClient
import { apiClient } from '../../services/api';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await apiClient.login(formData.username, formData.password);
        toast.success('Login successful!');
        onLoginSuccess(); // Update App state
        navigate('/dashboard');
      } else {
        // Pass the whole formData object
        await apiClient.register(formData);
        toast.success('Registration successful! Please log in.');
        setIsLogin(true); // Switch to login view
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-8 text-center">
          <Logo />
          <h2 className="mt-4 text-2xl font-bold text-gray-700">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <FormField
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          )}
          {!isLogin && (
            <FormField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}
          <FormField
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth>
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 font-semibold text-blue-600 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;