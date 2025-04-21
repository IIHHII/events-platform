import React from 'react';
import events from '../data/events';
import '../styles/eventsList.css';

const EventsList = () => {
  return (
    <div className="events-list">
      {events.map((event, index) => (
        <div className="event-card" key={index}>
          <div className="event-image" />
          <div className="event-info">
            <h3>{event.title}</h3>
            <p>{event.dateTime}</p>
          </div>
          <button className="sign-up-btn">Sign Up</button>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
