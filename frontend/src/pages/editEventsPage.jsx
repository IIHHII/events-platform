import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/eventsForm.css';
import API_URL from '../api';

const EditEventPage = ({ events, setEvents }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = events.find(e => e.id === +id);

  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (!existing) {
      navigate('/');
    } else {
      setTitle(existing.title);
      setDateTime(existing.dateTime);
      setLocation(existing.location);
      setDescription(existing.description);
      if (existing.image_url) {
        setImagePreview(`http://localhost:5000${existing.image_url}`);
      }
    }
  }, [existing, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('dateTime', dateTime);
    formData.append('location', location);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    fetch(`${API_URL}/api/events/${id}`, {
      method: 'PUT',
      body: formData
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update event');
        return res.json();
      })
      .then(updated => {
        setEvents(prev => prev.map(ev => ev.id === updated.id ? updated : ev));
        navigate('/events');
      })
      .catch(err => {
        console.error(err);
        alert('Failed to update event');
      });
  };

  return (
    <div className="form-container">
      <h2>Edit Event</h2>
      <form className="event-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="text" placeholder="Date & Time" value={dateTime} onChange={e => setDateTime(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />

        {imagePreview && (
          <div>
            <label>Current Image Preview:</label><br />
            <img src={imagePreview} alt="Event" style={{ width: '200px', marginBottom: '10px' }} />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditEventPage;
