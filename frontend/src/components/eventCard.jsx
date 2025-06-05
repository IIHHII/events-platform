import React from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';
import { formatUKDateTime } from '../utils/dateFormat';
import SignUpButton from './signUpButton';
import '../styles/eventCard.css';


const EventCard = ({ event, isPast, isLoggedIn, userRole, onDelete }) => {
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    return url?.startsWith('http') ? url : `${API_URL}${url}`;
  };

  return (
    <div
      className={`event-card ${isPast ? 'past' : ''}`}
      onClick={() => navigate(`/event/${event.id}`)}
    >
      {event.imageUrl && (
        <img
          className="event-image"
          src={getImageUrl(event.imageUrl)}
          alt={event.title}
          onError={(e) => (e.target.style.display = 'none')}
        />
      )}
      <h3>{event.title}</h3>
      <p><strong>Date:</strong> {formatUKDateTime(event.dateTime)}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p>{event.description}</p>
      {event.category && <p><strong>Category:</strong> {event.category}</p>}

      <div className="event-card-actions" onClick={(e) => e.stopPropagation()}>
        {isLoggedIn && userRole === 'staff' && !isPast && (
          <button onClick={() => navigate(`/edit-event/${event.id}`)}>Edit</button>
        )}
        {isLoggedIn && userRole === 'staff' && (
          <button onClick={() => onDelete(event.id)}>Delete</button>
        )}
        <SignUpButton event={event} isLoggedIn={isLoggedIn} isPast={isPast} />
      </div>
    </div>
  );
};

export default EventCard;
