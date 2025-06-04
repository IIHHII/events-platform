import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatUKDateTime } from '../utils/dateFormat';
import API_URL from '../api';
import '../styles/eventsList.css';

function EventsList({ events }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>All Events</h2>

      <ul className="events-list">
        {events.map((event) => (
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
            {event.category && <div className="event-category">Category: {event.category}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
