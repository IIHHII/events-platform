import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/header';
import EventsPage from './pages/eventsPage';
import LoginPage from './pages/loginPage';
import AddEventPage from './pages/addEventsPage';
import EditEventPage from './pages/editEventsPage';
import { getEvents } from './api/events';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            <EventsPage
              events={events}
              setEvents={setEvents}
              isLoggedIn={isLoggedIn}
            />
          }
        />

        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/add-event"
          element={
            isLoggedIn
              ? <AddEventPage events={events} setEvents={setEvents} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/edit-event/:id"
          element={
            isLoggedIn
              ? <EditEventPage events={events} setEvents={setEvents} />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
