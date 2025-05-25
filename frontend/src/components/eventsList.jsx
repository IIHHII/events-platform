import React, { useEffect, useState } from 'react';
import { getEvents } from '../api/events';

function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div>
      <h2>All Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <strong>{event.title}</strong> – {event.dateTime} @ {event.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
