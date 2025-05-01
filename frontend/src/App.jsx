import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EventsPage from './pages/eventsPage';
import AddEventPage from './pages/addEventsPage';
import './styles/App.css';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/add-event" style={{ border: '1px solid #000', padding: '8px 12px', borderRadius: '6px', textDecoration: 'none' }}>Sign In</Link>
      </div>
      <Routes>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/add-event" element={<AddEventPage />} />
        <Route path="*" element={<EventsPage />} />
      </Routes>
    </div>
  );
};

export default App;
 

