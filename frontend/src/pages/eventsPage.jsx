import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/eventsPage.css'
import '../styles/eventCard.css';
import '../styles/eventFilters.css'; 
import { deleteEvent } from '../api/events';
import API_URL from '../api';
import LoadingScreen from '../components/loadingScreen';
import EventCard from '../components/eventCard';
import EventFilters from '../components/eventFilters';

const EventsPage = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '', date: '' });

  const fetchEvents = async (filterParams = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filterParams).toString();
      const url = `${API_URL}/api/events${query ? '?' + query : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
      if (Object.keys(filterParams).length === 0) {
        setAllEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter((e) => e.id !== id));
        setAllEvents(allEvents.filter((e) => e.id !== id));
      } catch (err) {
        alert('Failed to delete event: ' + err.message);
      }
    }
  };

  const now = new Date();
  const pastThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const upcomingEvents = events.filter(ev => new Date(ev.dateTime) >= pastThreshold);
  const pastEvents = events.filter(ev => new Date(ev.dateTime) < pastThreshold);

  const uniqueLocations = Array.from(
    new Set(allEvents.map(ev => ev.location).filter(Boolean))
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchEvents(filters);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="events-page">
      <h2>Events</h2>

      <EventFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterSubmit={handleFilterSubmit}
        uniqueLocations={uniqueLocations}
      />

      <h3>Upcoming Events</h3>
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <>
          {isLoggedIn && userRole === 'staff' && (
            <div className="add-event-wrapper">
            <button
              className="add-event-button"
              onClick={() => navigate('/add-event')}
            >
              + Add Event
            </button>
            </div>
          )}
          {upcomingEvents
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                isPast={false}
                isLoggedIn={isLoggedIn}
                userRole={userRole}
                onDelete={handleDelete}
              />
            ))}
        </>
      )}

      <h3>Past Events</h3>
      {pastEvents.length === 0 ? (
        <p>No past events.</p>
      ) : (
        pastEvents
          .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
          .map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              isPast={true}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              onDelete={handleDelete}
            />
          ))
      )}
    </div>
  );
};

export default EventsPage;
