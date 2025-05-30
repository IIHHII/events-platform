import React, { useEffect, useState } from 'react';
import { getEvents } from '../api/events';
import { formatUKDateTime } from '../utils/dateFormat';
import LoadingScreen from './LoadingScreen';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <h2>All Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id} style={{ marginBottom: '1.5rem' }}>
            {event.image_url && (
              <img
                src={`http://localhost:5000${event.image_url}`}
                alt={event.title}
                style={{
                  maxWidth: '200px',
                  maxHeight: '150px',
                  objectFit: 'cover',
                  display: 'block',
                  marginBottom: '0.5rem'
                }}
              />
            )}
            <strong>{event.title}</strong> – {formatUKDateTime(event.dateTime)} @ {event.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
