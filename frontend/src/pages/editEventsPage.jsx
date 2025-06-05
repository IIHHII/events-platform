import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API_URL from '../api';
import EventForm from '../components/eventsForm';
import LoadingScreen from '../components/loadingScreen';
import '../styles/eventsForm.css';

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
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <EventForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitting={submitting}
      error={error}
      heading="Edit Event"
      submitButtonText="Update Event"
    />
  );
};

export default EditEventPage;
