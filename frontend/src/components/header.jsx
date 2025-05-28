import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import API_URL from '../api';

const Header = ({ isLoggedIn, onLogout }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    onLogout();
    window.location.href = `${API_URL}/auth/logout`;
  };

  return (
    <header className="main-header">
      <h1 className="site-title">Events Platform</h1>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        ) : (
          <a href={`${API_URL}/auth/google`}>
            <button>Sign In with Google</button>
          </a>
        )}
      </nav>
    </header>
  );
};

export default Header;
