import React, { useState } from 'react';
import '../styles/loginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'staff' && password === 'password123') {
      onLoginSuccess();
    } else {
      alert('Incorrect username or password');
    }
  };

  return (
    <form className="event-form" onSubmit={handleLogin}>
      <h2>Staff Sign In</h2>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;
