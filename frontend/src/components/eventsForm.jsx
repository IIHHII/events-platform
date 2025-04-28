import React, { useState } from 'react';
import LoginForm from './loginForm';
import '../styles/eventsForm.css';

const EventForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Event added: ${title} at ${dateTime}`);
    setTitle('');
    setDateTime('');
  };

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <h1>EVENTS</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Add New Event</h2>
        <label>
          Event Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Date / Time:
          <input
            type="text"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add Event</button>
      </form>
    </>
  );
};

export default EventForm;
