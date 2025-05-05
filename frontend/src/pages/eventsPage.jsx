import React, { useState } from 'react';
import Header from '../components/header';
import EventsList from '../components/eventsList';
import LoginForm from '../components/loginForm';

const EventsPage = () => {
  const [showLogin, setShowLogin] = useState(false);

  const handleSignInClick = () => {
    setShowLogin(true);
  };

  return (
    <>
      <Header onSignInClick={handleSignInClick} />
      {showLogin ? <LoginForm onLoginSuccess={() => setShowLogin(false)} /> : (
        <>
          <h2>Upcoming Events</h2>
          <EventsList />
        </>
      )}
    </>
  );
};

export default EventsPage;
