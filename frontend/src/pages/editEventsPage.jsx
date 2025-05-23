import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/eventsForm.css';
import { updateEvent } from '../api/events';

const EditEventPage = ({ events, setEvents }) => {
  const { id } = useParams();
  const nav = useNavigate();
  const existing = events.find(e => e.id === +id);

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!existing) {
      nav('/');
    } else {
      setTitle(existing.title);
      setDateTime(existing.dateTime);
      setLocation(existing.location);
      setDescription(existing.description);
    }
  }, [existing, nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEvent = await updateEvent(id, { title, dateTime, location, description });
      setEvents(events.map(e => e.id === +id ? updatedEvent : e));
      nav('/');
    } catch (error) {
      alert('Failed to update event: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Event</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Date & Time" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEventPage;
