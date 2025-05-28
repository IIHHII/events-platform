import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/eventsList.css';
import { deleteEvent } from '../api/events';
import API_URL from '../api';
import { formatUKDateTime } from '../utils/dateFormat';
import LoadingScreen from '../components/loadingScreen';

const EventsPage = ({ events, setEvents, isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter(e => e.id !== id));
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

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const upcomingEvents = [...events]
    .filter(event => new Date(event.dateTime) >= twentyFourHoursAgo)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  const pastEvents = [...events]
    .filter(event => new Date(event.dateTime) < twentyFourHoursAgo)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

  if (loading) return <LoadingScreen />;

  return (
    <div className="events-page">
      <h2>Events</h2>

      <h3>Upcoming Events</h3>
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        upcomingEvents.map(event => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {formatUKDateTime(event.dateTime)}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>{event.description}</p>

            {isLoggedIn && userRole === 'staff' ? (
              <div className="event-card-actions">
                <button onClick={() => navigate(`/edit-event/${event.id}`)}>Edit</button>
                <button onClick={() => handleDelete(event.id)}>Delete</button>
              </div>
            ) : (
              <div className="event-card-actions">
                <button className="sign-up-btn" onClick={() => handleSignUp(event)}>Sign Up</button>
              </div>
            )}
          </div>
        ))
      )}

      <h3>Past Events</h3>
      {pastEvents.length === 0 ? (
        <p>No past events.</p>
      ) : (
        pastEvents.map(event => (
          <div className="event-card past" key={event.id}>
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {formatUKDateTime(event.dateTime)}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>{event.description}</p>
          </div>
        ))
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

