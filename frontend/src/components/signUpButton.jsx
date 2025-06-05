import React, { useState } from 'react';
import API_URL from '../api';
import LoadingScreen from './loadingScreen';

const SignUpButton = ({ event, isLoggedIn, isPast }) => {
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/google/calendar/add-event`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          title: event.title,
          dateTime: event.dateTime,
        }),
      });

      const result = await res.json();

      if (res.status === 400 || res.status === 401) {
        alert('Your Google session has expired. Redirecting...');
        window.location.href = '/auth/google';
        return;
      }

      if (res.ok) {
        alert('Event added to your Google Calendar!');
      } else {
        alert('Failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || isPast) return null;
  if (loading) return <LoadingScreen />;
  return (
    <button className="sign-up-btn" onClick={handleSignUp}>
      Sign Up
    </button>
  );
};

export default SignUpButton;
