import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/eventsList.css';
import { deleteEvent } from '../api/events';
import API_URL from '../api';
import { formatUKDateTime } from '../utils/dateFormat';
import LoadingScreen from '../components/loadingScreen';

const EventsPage = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: ''
  });

  const fetchEvents = async (filterParams = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filterParams.category) query.append('category', filterParams.category);
      if (filterParams.location) query.append('location', filterParams.location);
      if (filterParams.date) query.append('date', filterParams.date);

      const queryString = query.toString();
      const url = queryString
        ? `${API_URL}/api/events?${queryString}`
        : `${API_URL}/api/events`;

      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
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
      } catch (error) {
        alert('Failed to delete event: ' + error.message);
      }
    }
  };

  const handleSignUp = async (event) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/google/calendar/add-event`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          title: event.title,
          dateTime: event.dateTime,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Event added to your Google Calendar!');
      } else {
        alert('Failed: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchEvents(filters);
  };

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const upcomingEvents = [...events]
    .filter((event) => new Date(event.dateTime) >= twentyFourHoursAgo)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const pastEvents = [...events]
    .filter((event) => new Date(event.dateTime) < twentyFourHoursAgo)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  if (loading) return <LoadingScreen />;

  const renderEventCard = (event, isPast = false) => {
    const fullImageUrl = event.imageUrl
      ? (event.imageUrl.startsWith('http') ? event.imageUrl : `${API_URL}${event.imageUrl}`)
      : null;

    return (
      <div
        key={event.id}
        className={`event-card ${isPast ? 'past' : ''}`}
        onClick={() => navigate(`/event/${event.id}`)}
        style={{ cursor: 'pointer' }}
      >
        {event.imageUrl && (
          <img
            className="event-image"
            src={fullImageUrl}
            alt={event.title}
            onError={(e) => {
              console.warn('Image failed to load for:', event.title, fullImageUrl);
              e.target.style.display = 'none';
            }}
          />
        )}

        <h3>{event.title}</h3>
        <p><strong>Date:</strong> {formatUKDateTime(event.dateTime)}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p>{event.description}</p>
        {event.category && <p><strong>Category:</strong> {event.category}</p>}

        <div className="event-card-actions" onClick={(e) => e.stopPropagation()}>
          {isLoggedIn && userRole === 'staff' ? (
            <>
              {!isPast && <button onClick={() => navigate(`/edit-event/${event.id}`)}>Edit</button>}
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </>
          ) : (!isPast && isLoggedIn) ? (
            <button className="sign-up-btn" onClick={() => handleSignUp(event)}>Sign Up</button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="events-page">
      <h2>Events</h2>

      <form className="filter-container" onSubmit={handleFilterSubmit}>
        <input
          name="category"
          placeholder="Filter by category"
          value={filters.category}
          onChange={handleFilterChange}
        />
        <input
          name="location"
          placeholder="Filter by location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />
        <button type="submit">Apply Filters</button>
      </form>

      <h3>Upcoming Events</h3>
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        upcomingEvents.map((event) => renderEventCard(event))
      )}

      <h3>Past Events</h3>
      {pastEvents.length === 0 ? (
        <p>No past events.</p>
      ) : (
        pastEvents.map((event) => renderEventCard(event, true))
      )}

      {isLoggedIn && userRole === 'staff' && (
        <button className="add-event-button" onClick={() => navigate('/add-event')}>
          + Add Event
        </button>
      )}
    </div>
  );
};

export default EventsPage;
