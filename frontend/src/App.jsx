import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsPage from './pages/eventsPage';
import AddEventPage from './pages/addEventsPage';
import './styles/App.css';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <Routes>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/add-event" element={<AddEventPage />} />
        <Route path="*" element={<EventsPage />} />
      </Routes>
    </div>
  );
};

export default App;
