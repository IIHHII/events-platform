import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../api';
import '../styles/eventsForm.css';
import LoadingScreen from '../components/loadingScreen';

const EditEventPage = ({ events, setEvents }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    dateTime: '',
    location: '',
    category: 'Music',
    description: '',
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events/${id}`);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to load event');
        }
        const data = await response.json();
        setFormData({
          title: data.title,
          dateTime: data.dateTime.slice(0, 16),
          location: data.location || '',
          category: data.category || 'Music',
          description: data.description || '',
          image: null,
        });
      } catch (err) {
        console.error('Error loading event:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('dateTime', formData.dateTime);
      data.append('location', formData.location);
      data.append('category', formData.category);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: data,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update event');
      }

      const updatedEvent = await response.json();
      setEvents(events.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev)));
      navigate('/');
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="event-form-container">
      <h2>Edit Event</h2>
      {error && <p className="error-text">{error}</p>}

      <form className="event-form" onSubmit={handleSubmit}>
        <label>
          <span>Title:</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Date / Time:</span>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Location:</span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>Category:</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Music">Music</option>
            <option value="Sport">Sport</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          <span>Description:</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <label>
          <span>Replace Image (optional):</span>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Updating…' : 'Update Event'}
        </button>
      </form>
    </div>
  );
};

export default EditEventPage;
