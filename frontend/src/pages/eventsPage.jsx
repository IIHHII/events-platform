import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import EventsList from '../components/eventsList';
import LoginForm from '../components/loginForm';

const EventsPage = ({ isLoggedIn, onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate('/add-event');
    return null;
  }

  const handleSignInClick = () => {
    setShowLogin(true);
  };

  return (
    <>
      <Header onSignInClick={handleSignInClick} />
      {showLogin ? (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      ) : (
        <>
          <h2>Upcoming Events</h2>
          <EventsList />
        </>
      )}
    </>
  );
};

export default EventsPage;
