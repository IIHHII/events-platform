import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <h1 className="site-title">Events Platform</h1>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        {isLoggedIn ? (
          <>
            <button onClick={() => { onLogout(); navigate('/'); }}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>
            Sign In
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
