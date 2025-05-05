import React from 'react';
import '../styles/header.css';
import logo from '../assets/black.jpeg';

const Header = ({ onSignInClick }) => {

  return (
    <header className="main-header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="site-title">
          Events Platform
        </h1>
      </div>
      <button className="sign-in-btn" onClick={onSignInClick}>
        Sign In
      </button>
    </header>
  );
};

export default Header;
