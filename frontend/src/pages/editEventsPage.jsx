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
            <option value="Other">Other</option>
            <option value="Alumni Meetup">Alumni Meetup</option>
            <option value="Anime & Manga">Anime & Manga</option>
            <option value="Architecture">Architecture</option>
            <option value="Art">Art</option>
            <option value="Awareness Campaign">Awareness Campaign</option>
            <option value="Board Game Night">Board Game Night</option>
            <option value="Business">Business</option>
            <option value="Camping Trip">Camping Trip</option>
            <option value="Career Fair">Career Fair</option>
            <option value="Charity">Charity</option>
            <option value="City Tour">City Tour</option>
            <option value="Coding / Programming">Coding / Programming</option>
            <option value="Coding Bootcamp">Coding Bootcamp</option>
            <option value="Community">Community</option>
            <option value="Conference">Conference</option>
            <option value="Cooking Class">Cooking Class</option>
            <option value="Cosplay / Costume Party">Cosplay / Costume Party</option>
            <option value="Crafts & DIY">Crafts & DIY</option>
            <option value="Cultural Celebration">Cultural Celebration</option>
            <option value="Dance">Dance</option>
            <option value="Design">Design</option>
            <option value="Education">Education</option>
            <option value="Environmental / Sustainability">Environmental / Sustainability</option>
            <option value="Expo / Trade Show">Expo / Trade Show</option>
            <option value="Family">Family</option>
            <option value="Fashion">Fashion</option>
            <option value="Festival">Festival</option>
            <option value="Film">Film</option>
            <option value="Financial Literacy">Financial Literacy</option>
            <option value="Fitness Class">Fitness Class</option>
            <option value="Food & Drink">Food & Drink</option>
            <option value="Fundraiser">Fundraiser</option>
            <option value="Gaming">Gaming</option>
            <option value="Gardening">Gardening</option>
            <option value="Garage Sale">Garage Sale</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Hiking / Outdoor Adventure">Hiking / Outdoor Adventure</option>
            <option value="Kids' Crafts">Kids' Crafts</option>
            <option value="Karaoke">Karaoke</option>
            <option value="Language Class">Language Class</option>
            <option value="Language Exchange">Language Exchange</option>
            <option value="Life Coaching">Life Coaching</option>
            <option value="Literature / Book Club">Literature / Book Club</option>
            <option value="Meditation">Meditation</option>
            <option value="Mindfulness">Mindfulness</option>
            <option value="Movie Screening">Movie Screening</option>
            <option value="Music">Music</option>
            <option value="Networking">Networking</option>
            <option value="Nutrition">Nutrition</option>
            <option value="Open Mic">Open Mic</option>
            <option value="Panel Discussion">Panel Discussion</option>
            <option value="Personal Development">Personal Development</option>
            <option value="Photography">Photography</option>
            <option value="Pitch Night">Pitch Night</option>
            <option value="Poetry">Poetry</option>
            <option value="Pop-up Market">Pop-up Market</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Protest / Rally">Protest / Rally</option>
            <option value="Public Speaking">Public Speaking</option>
            <option value="Religious">Religious</option>
            <option value="Research Symposium">Research Symposium</option>
            <option value="Retreat">Retreat</option>
            <option value="Science">Science</option>
            <option value="Sport">Sport</option>
            <option value="Stand-up Comedy">Stand-up Comedy</option>
            <option value="Startup Meetup">Startup Meetup</option>
            <option value="STEM for Kids">STEM for Kids</option>
            <option value="Story Time">Story Time</option>
            <option value="Summer Camp">Summer Camp</option>
            <option value="Technology">Technology</option>
            <option value="Teen Hangout">Teen Hangout</option>
            <option value="Theater">Theater</option>
            <option value="Travel">Travel</option>
            <option value="Trivia Night">Trivia Night</option>
            <option value="Volunteer Event">Volunteer Event</option>
            <option value="Workshop">Workshop</option>
            <option value="Yoga">Yoga</option>
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
