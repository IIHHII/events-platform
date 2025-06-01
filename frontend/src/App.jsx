import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/header';
import EventsPage from './pages/eventsPage';
import AddEventPage from './pages/addEventsPage';
import EditEventPage from './pages/editEventsPage';
import EventDetailPage from './pages/eventDetailPage';
import { getEvents } from './api/events';
import API_URL from './api';
import LoadingScreen from './components/loadingScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(data.isLoggedIn ?? false);
          setUserRole(data.role || null);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setIsLoggedIn(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    checkAuthStatus();
    fetchEvents();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return loading ? (
    <LoadingScreen />
  ) : (
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
              userRole={userRole}
            />
          }
        />

        <Route
          path="/event/:id"
          element={<EventDetailPage user={{ role: userRole }} />}
        />

        <Route
          path="/add-event"
          element={
            isLoggedIn && userRole === 'staff' ? (
              <AddEventPage events={events} setEvents={setEvents} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/edit-event/:id"
          element={
            isLoggedIn && userRole === 'staff' ? (
              <EditEventPage events={events} setEvents={setEvents} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
