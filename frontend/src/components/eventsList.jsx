import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatUKDateTime } from '../utils/dateFormat';
import LoadingScreen from './loadingScreen';
import API_URL from '../api';
import '../styles/eventsList.css';

function EventsList() {
  console.log("EventsList rendered");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ category: '', location: '', date: '' });
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter changed: ${name} = ${value}`);
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFilterClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.category) query.append('category', filters.category);
      if (filters.location) query.append('location', filters.location);
      if (filters.date) query.append('date', filters.date);
      
      const queryString = query.toString();
      const url = `${API_URL}/api/events?${queryString}`;

      console.log('Sending request to:', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      console.log('Filtered events received:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching filtered events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div>
      <h2>All Events</h2>

      <form className="filter-container" onSubmit={handleFilterClick}>
        <input
          name="category"
          placeholder="Filter by category"
          value={filters.category}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Filter by location"
          value={filters.location}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
        />
        <button type="submit">Apply Filters</button>
      </form>

      <ul className="events-list">
        {events.map((event) => (
          <li
            key={event.id}
            className="events-list-item"
            onClick={() => navigate(`/event/${event.id}`)}
          >
            {event.imageUrl && (
              <img
                src={
                  event.imageUrl.startsWith('http')
                    ? event.imageUrl
                    : `${API_URL}${event.imageUrl}`
                }
                alt={event.title}
              />
            )}
            <strong>{event.title}</strong> – {formatUKDateTime(event.dateTime)} @ {event.location}
            {event.category && <div className="event-category">Category: {event.category}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsList;
