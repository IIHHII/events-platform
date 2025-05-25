import React from 'react';
import { useNavigate } from 'react-router-dom';

const StaffDashboardPage = ({ events, setEvents }) => {
  const navigate = useNavigate();

  const handleDelete = async (eventId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleAdd = () => {
    navigate('/add-event');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Event
      </button>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="p-4 border rounded shadow-sm">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p>{event.description}</p>
              <p>Date: {event.date}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(event.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StaffDashboardPage;
