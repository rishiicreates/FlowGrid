import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isSignUp ? '/signup' : '/login';
      const response = await axios.post(`http://localhost:5000${endpoint}`, {
        email,
        password
      });
      
      if (response.data.userId) {
        onLogin(response.data.userId);
      } else if (isSignUp) {
        setIsSignUp(false); // Switch to login after successful signup
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">
          {isSignUp ? 'Create Account' : 'Login'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:text-blue-700"
          >
            {isSignUp 
              ? 'Already have an account? Login' 
              : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;