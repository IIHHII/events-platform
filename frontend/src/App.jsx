import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsPage from './pages/eventsPage';
import AddEventPage from './pages/addEventsPage';
import './styles/App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <Routes>
        <Route
          path="/events"
          element={
            <EventsPage
              isLoggedIn={isLoggedIn}
              onLoginSuccess={() => setIsLoggedIn(true)}
            />
          }
        />
        <Route
          path="/add-event"
          element={<AddEventPage isLoggedIn={isLoggedIn} />}
        />
        <Route
          path="*"
          element={
            <EventsPage
              isLoggedIn={isLoggedIn}
              onLoginSuccess={() => setIsLoggedIn(true)}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
