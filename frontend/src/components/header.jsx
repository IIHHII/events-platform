import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ isLoggedIn }) => {
  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  return (
    <header className="main-header">
      <h1 className="site-title">Events Platform</h1>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <a href="http://localhost:5000/auth/google">
            <button>Sign In with Google</button>
          </a>
        )}
      </nav>
    </header>
  );
};

export default Header;
