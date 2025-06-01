import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../api/events';
import { formatUKDateTime } from '../utils/dateFormat';
import LoadingScreen from './loadingScreen';
import API_URL from '../api';
import '../styles/eventsList.css';

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <ul className="events-list">
        {events.map(event => (
          <li
            key={event.id}
            className="events-list-item"
            onClick={() => navigate(`/event/${event.id}`)}
          >
            {event.imageUrl && (
              <img
                src={
                  event.imageUrl.startsWith('http')
                    ? event.imageUrl
                    : `${API_URL}${event.imageUrl}`
                }
                alt={event.title}
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
