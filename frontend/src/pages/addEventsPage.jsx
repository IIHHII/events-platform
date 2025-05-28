import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/eventsForm.css';
import { createEvent } from '../api/events';

const AddEventPage = ({ events, setEvents }) => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEvent = await createEvent({ title, dateTime, location, description });
      setEvents([...events, newEvent]);
      nav('/');
    } catch (error) {
      alert('Failed to add event: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Event</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name Of Event" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Date & Time (e.g., 01/02/2023, 11:00pm)" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEventPage;
