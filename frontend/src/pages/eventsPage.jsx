import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/eventsList.css';

const EventsPage = ({ events, setEvents, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm('Delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  return (
    <div className="events-page">
      <h2>Upcoming Events</h2>

      {events.map(event => (
        <div className="event-card" key={event.id}>
          <h3>{event.title}</h3>
          <p><strong>Date:</strong> {event.dateTime}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p>{event.description}</p>

          {isLoggedIn ? (
            <div className="event-card-actions">
              <button onClick={() => navigate(`/edit-event/${event.id}`)}>Edit</button>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          ) : (
            <div className="event-card-actions">
              <button className="sign-up-btn">Sign Up</button>
            </div>
          )}
        </div>
      ))}


      {isLoggedIn && (
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
