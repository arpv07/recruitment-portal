import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../../store/authSlice';
import { toast } from 'react-toastify';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AgreeyaLogo from '../../assets/agreeya-logo.png'; // Update path

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    linkedInUrl: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(login({ username: formData.username, password: formData.password })).unwrap();
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        await dispatch(register(formData)).unwrap();
        toast.success('Registration successful! Logging you in...');
        await dispatch(login({ username: formData.username, password: formData.password })).unwrap();
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred.');
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-gradient-to-tr from-blue-50 to-indigo-100">
      
      {/* Subtle animated background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "loop" }}
        style={{
          background: "linear-gradient(135deg, #e0f2ff 25%, #cfe0ff 50%, #e0f2ff 75%)",
          backgroundSize: "400% 400%"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 overflow-hidden"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={AgreeyaLogo} alt="Agreeya Logo" className="w-28 h-28 object-contain" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">
          {isLogin ? 'Welcome Back!' : 'Create Your Account'}
        </h2>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'register'}
            onSubmit={handleSubmit}
            className="w-full space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <FormField
              label="Username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
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
                  label="Phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <FormField
                  label="Location"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
                <FormField
                  label="LinkedIn URL"
                  type="text"
                  name="linkedInUrl"
                  value={formData.linkedInUrl}
                  onChange={handleChange}
                />
              </>
            )}
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
              className="w-full mt-2 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transform transition-transform duration-200 hover:scale-105"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Submitting...' : isLogin ? 'Login' : 'Register'}
            </Button>
          </motion.form>
        </AnimatePresence>

        {/* Toggle Login/Register */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-sm text-indigo-600 hover:underline"
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </motion.div>
    </div>
  );
};

export default AuthPage;
