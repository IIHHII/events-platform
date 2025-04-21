import React, { useState } from 'react';
import '../styles/eventsForm.css';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Event added: ${title} at ${dateTime}`);
    setTitle('');
    setDateTime('');
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <label>
        Event Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Date / Time:
        <input type="text" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
      </label>
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
