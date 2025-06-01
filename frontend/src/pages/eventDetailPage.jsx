import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, deleteEvent } from '../api/events';
import LoadingScreen from '../components/loadingScreen';
import { formatUKDateTime } from '../utils/dateFormat';
import '../styles/eventDetailPage.css';

function EventDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventById(id)
      .then(setEvent)
      .catch(() => setError('Failed to load event'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        navigate('/');
      } catch {
        alert('Failed to delete event.');
      }
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <p>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="event-detail-container">
      {event.imageUrl && (
        <img
          src={`http://localhost:5000${event.imageUrl}`}
          alt={event.title}
          className="event-detail-image"
        />
      )}
      <h2 className="event-detail-title">{event.title}</h2>
      <p className="event-detail-info"><strong>Date & Time:</strong> {formatUKDateTime(event.dateTime)}</p>
      <p className="event-detail-info"><strong>Location:</strong> {event.location}</p>
      <p className="event-detail-description">{event.description}</p>

      {user?.role === 'staff' && (
        <div className="event-detail-actions">
          <button
            onClick={() => navigate(`/edit-event/${event.id}`)}
            className="event-detail-button edit"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="event-detail-button delete"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default EventDetailPage;
