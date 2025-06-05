import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/eventsList.css';
import { deleteEvent } from '../api/events';
import API_URL from '../api';
import { formatUKDateTime } from '../utils/dateFormat';
import LoadingScreen from '../components/loadingScreen';

const categoryOptions = [
  "Other", "Alumni Meetup", "Anime & Manga", "Architecture", "Art",
  "Awareness Campaign", "Board Game Night", "Business", "Camping Trip",
  "Career Fair", "Charity", "City Tour", "Coding / Programming", "Coding Bootcamp",
  "Community", "Conference", "Cooking Class", "Cosplay / Costume Party",
  "Crafts & DIY", "Cultural Celebration", "Dance", "Design", "Education",
  "Environmental / Sustainability", "Expo / Trade Show", "Family", "Fashion",
  "Festival", "Film", "Financial Literacy", "Fitness Class", "Food & Drink",
  "Fundraiser", "Gaming", "Gardening", "Garage Sale", "Health & Wellness",
  "Hiking / Outdoor Adventure", "Kids' Crafts", "Karaoke", "Language Class",
  "Language Exchange", "Life Coaching", "Literature / Book Club", "Meditation",
  "Mindfulness", "Movie Screening", "Music", "Networking", "Nutrition",
  "Open Mic", "Panel Discussion", "Personal Development", "Photography",
  "Pitch Night", "Poetry", "Pop-up Market", "Product Launch", "Protest / Rally",
  "Public Speaking", "Religious", "Research Symposium", "Retreat", "Science",
  "Sport", "Stand-up Comedy", "Startup Meetup", "STEM for Kids", "Story Time",
  "Summer Camp", "Technology", "Teen Hangout", "Theater", "Travel",
  "Trivia Night", "Volunteer Event", "Workshop", "Yoga"
];

const EventsPage = ({ isLoggedIn, userRole }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '', date: '' });

  const fetchEvents = async (filterParams = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filterParams).toString();
      const url = `${API_URL}/api/events${query ? '?' + query : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
      if (Object.keys(filterParams).length === 0) {
        setAllEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await deleteEvent(id);
        setEvents(events.filter((e) => e.id !== id));
        setAllEvents(allEvents.filter((e) => e.id !== id));
      } catch (err) {
        alert('Failed to delete event: ' + err.message);
      }
    }
  };

  const handleSignUp = async ({ id, title, dateTime }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/google/calendar/add-event`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: id, title, dateTime }),
      });

      const result = await res.json();

      if (res.status === 400 || res.status === 401) {
        alert('Your Google session has expired. Redirecting...');
        window.location.href = '/auth/google';
        return;
      }

      if (res.ok) {
        alert('Event added to your Google Calendar!');
      } else {
        alert('Failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchEvents(filters);
  };

  const now = new Date();
  const pastThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const upcomingEvents = events.filter(ev => new Date(ev.dateTime) >= pastThreshold);
  const pastEvents = events.filter(ev => new Date(ev.dateTime) < pastThreshold);

  const uniqueLocations = Array.from(
    new Set(allEvents.map(ev => ev.location).filter(Boolean))
  );

  const getImageUrl = (url) => {
    return url?.startsWith('http') ? url : `${API_URL}${url}`;
  };

  const renderSignUpButton = (ev, isPast) => {
    if (!isLoggedIn || isPast) return null;
    return (
      <button className="sign-up-btn" onClick={() => handleSignUp(ev)}>
        Sign Up
      </button>
    );
  };

  const renderEventCard = (ev, isPast = false) => (
    <div
      key={ev.id}
      className={`event-card ${isPast ? 'past' : ''}`}
      onClick={() => navigate(`/event/${ev.id}`)}
    >
      {ev.imageUrl && (
        <img
          className="event-image"
          src={getImageUrl(ev.imageUrl)}
          alt={ev.title}
          onError={(e) => (e.target.style.display = 'none')}
        />
      )}
      <h3>{ev.title}</h3>
      <p><strong>Date:</strong> {formatUKDateTime(ev.dateTime)}</p>
      <p><strong>Location:</strong> {ev.location}</p>
      <p>{ev.description}</p>
      {ev.category && <p><strong>Category:</strong> {ev.category}</p>}

      <div className="event-card-actions" onClick={(e) => e.stopPropagation()}>
        {isLoggedIn && userRole === 'staff' && !isPast && (
          <button onClick={() => navigate(`/edit-event/${ev.id}`)}>Edit</button>
        )}
        {isLoggedIn && userRole === 'staff' && (
          <button onClick={() => handleDelete(ev.id)}>Delete</button>
        )}
        {renderSignUpButton(ev, isPast)}
      </div>
    </div>
  );

  if (loading) return <LoadingScreen />;

  return (
    <div className="events-page">
      <h2>Events</h2>

      <form className="filter-container" onSubmit={handleFilterSubmit}>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select name="location" value={filters.location} onChange={handleFilterChange}>
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        <button type="submit">Apply Filters</button>
      </form>

      <h3>Upcoming Events</h3>
      {upcomingEvents.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        upcomingEvents
          .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
          .map((ev) => renderEventCard(ev))
      )}

      <h3>Past Events</h3>
      {pastEvents.length === 0 ? (
        <p>No past events.</p>
      ) : (
        pastEvents
          .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
          .map((ev) => renderEventCard(ev, true))
      )}
    </div>
  );
};

export default EventsPage;
