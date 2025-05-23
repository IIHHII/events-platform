import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/header';
import EventsPage from './pages/eventsPage';
import LoginPage from './pages/loginPage';
import AddEventPage from './pages/addEventsPage';
import EditEventPage from './pages/editEventsPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, title: 'Community BBQ', dateTime: '2025-06-01 12:00', location: 'Central Park', description: 'Join us for food and fun!' },
    { id: 2, title: 'Book Club Meeting', dateTime: '2025-06-05 18:00', location: 'Library Room 3', description: 'Discussing "The Great Gatsby".' },
  ]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

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
