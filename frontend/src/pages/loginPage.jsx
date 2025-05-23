import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginForm.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'staff' && password === 'password123') {
      onLogin();
      nav('/');
    } else {
      alert('Incorrect username or password');
    }
  };

  return (
    <div className="login-container">
      <h2>Staff Sign In</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;
