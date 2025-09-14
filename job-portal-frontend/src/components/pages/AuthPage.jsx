import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Logo from '../ui/Logo';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { apiClient } from '../../services/api';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    linkedin: '',
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
        onLoginSuccess();
        navigate('/dashboard');
      } else {
        // Adjust payload to match Python backend
        const payload = {
          full_name: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          phone_number: formData.phoneNumber,
          linkedin: formData.linkedin,
        };
        await apiClient.register(payload);
        toast.success('Registration successful! Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 relative">
          {/* Logo Centered */}
          <div className="flex justify-center mb-6">
            <Logo className="h-14 w-auto" />
          </div>

          {/* Heading */}
          <h2 className="text-center text-2xl font-extrabold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-center text-gray-500 mt-1 mb-6">
            Please {isLogin ? 'sign in to continue' : 'fill the form to register'}.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <FormField
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="LinkedIn URL"
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </>
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
            <Button
              type="submit"
              fullWidth
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-200"
            >
              {isLogin ? 'Sign In' : 'Register'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
