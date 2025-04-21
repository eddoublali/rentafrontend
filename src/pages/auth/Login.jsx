import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api'; // Your Axios instance
import { z } from 'zod';
import rentalogo from "../../assets/rentalogo.png";
import { AlertCircle } from 'lucide-react';

// Create Zod schema for validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const Login = () => {
  const { login } = useAuth(); // From AuthContext
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Validate form data using Zod
    const result = loginSchema.safeParse({ email, password });
    
    if (result.success) {
      setIsLoading(true);
      try {
        const res = await api.post('/auth/login', { email, password });
        login(res.data); // This will save user and token
        navigate('/'); // Redirect after login
      } catch (err) {
        setServerError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } else {
      // Set errors from Zod validation
      const newErrors = result.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(newErrors);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-lg p-8 space-y-8 rounded-lg shadow-xl  border border-base-content/10 ">
        <div className="text-center">
          <img 
            src={rentalogo} 
            alt="Rental Logo" 
            className="mx-auto h-20 w-auto" 
          />
          <h2 className="mt-6 text-3xl font-extrabold ">Welcome back</h2>
          <p className="mt-2 text-sm">Sign in to your account</p>
        </div>
        
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{serverError}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email" className="block text-sm font-medium ">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm  focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium ">
                  Password
                </label>
              
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
      
      </div>
    </div>
  );
};

export default Login;