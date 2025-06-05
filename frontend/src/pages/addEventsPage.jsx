import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../api';
import EventForm from '../components/eventsForm';
import '../styles/eventsForm.css';

const AddEventPage = ({ events, setEvents }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    dateTime: '',
    location: '',
    category: 'Other',
    description: '',
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

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

      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        credentials: 'include',
        body: data,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create event');
      }

      const createdEvent = await response.json();
      setEvents([...events, createdEvent]);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <EventForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      submitting={submitting}
      error={error}
      heading="Add New Event"
      submitButtonText="Add Event"
    />
  );
};

export default AddEventPage;
