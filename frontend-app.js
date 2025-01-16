import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    !!localStorage.getItem('userId')
  );

  const handleLogin = (userId) => {
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )
            } 
          />
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;