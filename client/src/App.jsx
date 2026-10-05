import React, { useState } from 'react';
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notes from './pages/Notes';

function App() {
  // Initialize auth state from localStorage so session persists on refresh
  const [token, setToken] = useState(() => localStorage.getItem('notes_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('notes_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Controls view between 'login' and 'signup' for unauthenticated users
  const [currentPage, setCurrentPage] = useState('login');

  // Handle successful login/signup
  const handleAuthSuccess = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('notes_token', jwtToken);
    localStorage.setItem('notes_user', JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('notes_token');
    localStorage.removeItem('notes_user');
    setCurrentPage('login');
  };

  // If user is logged in, show Notes page
  if (token && user) {
    return <Notes user={user} token={token} onLogout={handleLogout} />;
  }

  // Otherwise show Login or Signup page
  return currentPage === 'signup' ? (
    <Signup
      onSwitchToLogin={() => setCurrentPage('login')}
      onAuthSuccess={handleAuthSuccess}
    />
  ) : (
    <Login
      onSwitchToSignup={() => setCurrentPage('signup')}
      onAuthSuccess={handleAuthSuccess}
    />
  );
}

export default App;
