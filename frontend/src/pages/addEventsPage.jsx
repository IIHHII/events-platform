import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/eventsForm.css';
import API_URL from '../api';

const AddEventPage = ({ events, setEvents }) => {
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('dateTime', dateTime);
    formData.append('location', location);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to add event');
      const newEvent = await res.json();
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
        
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />

        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEventPage;
