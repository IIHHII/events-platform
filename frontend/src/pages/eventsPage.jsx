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

  const handleSignUp = async (eventObj) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/google/calendar/add-event`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventObj.id,
          title: eventObj.title,
          dateTime: eventObj.dateTime,
        }),
      });

      if (response.status === 400) {
        const err = await response.json();
        if (err.error === 'Google tokens missing') {
          alert('Your Google session has expired. Redirecting to re-authenticate.');
          window.location.href = '/auth/google';
          return;
        }
      }
      if (response.status === 401) {
        const err = await response.json();
        if (
          err.error === 'Google token expired or revoked. Please re-authenticate.'
        ) {
          alert('Your Google session has expired. Redirecting to re-authenticate.');
          window.location.href = '/auth/google';
          return;
        }
      }

      const data = await response.json();
      if (response.ok) {
        alert('Event added to your Google Calendar!');
      } else {
        alert('Failed: ' + (data.error || 'Unknown error'));
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
    .filter((ev) => new Date(ev.dateTime) >= twentyFourHoursAgo)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const pastEvents = [...events]
    .filter((ev) => new Date(ev.dateTime) < twentyFourHoursAgo)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  const uniqueLocations = Array.from(
    new Set(events.map((ev) => ev.location).filter((loc) => loc && loc.trim() !== ''))
  );

  if (loading) return <LoadingScreen />;

  const renderEventCard = (ev, isPast = false) => {
    const fullImageUrl = ev.imageUrl
      ? (ev.imageUrl.startsWith('http')
          ? ev.imageUrl
          : `${API_URL}${ev.imageUrl}`)
      : null;

    return (
      <div
        key={ev.id}
        className={`event-card ${isPast ? 'past' : ''}`}
        onClick={() => navigate(`/event/${ev.id}`)}
        style={{ cursor: 'pointer' }}
      >
        {ev.imageUrl && (
          <img
            className="event-image"
            src={fullImageUrl}
            alt={ev.title}
            onError={(e) => {
              console.warn(
                'Image failed to load for:',
                ev.title,
                fullImageUrl
              );
              e.target.style.display = 'none';
            }}
          />
        )}

        <h3>{ev.title}</h3>
        <p>
          <strong>Date:</strong> {formatUKDateTime(ev.dateTime)}
        </p>
        <p>
          <strong>Location:</strong> {ev.location}
        </p>
        <p>{ev.description}</p>
        {ev.category && (
          <p>
            <strong>Category:</strong> {ev.category}
          </p>
        )}

        <div
          className="event-card-actions"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoggedIn && userRole === 'staff' ? (
            <>
              {!isPast && (
                <button onClick={() => navigate(`/edit-event/${ev.id}`)}>
                  Edit
                </button>
              )}
              <button onClick={() => handleDelete(ev.id)}>Delete</button>
            </>
          ) : (!isPast && isLoggedIn) ? (
            <button
              className="sign-up-btn"
              onClick={() => handleSignUp(ev)}
            >
              Sign Up
            </button>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="events-page">
      <h2>Events</h2>

      <form className="filter-container" onSubmit={handleFilterSubmit}>
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Sport">Sport</option>
          <option value="Other">Other</option>
        </select>

        <select
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

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
        upcomingEvents.map((ev) => renderEventCard(ev))
      )}

      <h3>Past Events</h3>
      {pastEvents.length === 0 ? (
        <p>No past events.</p>
      ) : (
        pastEvents.map((ev) => renderEventCard(ev, true))
      )}

      {isLoggedIn && userRole === 'staff' && (
        <button
          className="add-event-button"
          onClick={() => navigate('/add-event')}
        >
          + Add Event
        </button>
      )}
    </div>
  );
};

export default EventsPage;
