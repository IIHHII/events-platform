import React from 'react';
import EventsList from '../components/eventsList';
import '../styles/eventsList.css';

const EventsPage = () => {
  return (
    <>
      <h2>Upcoming Events</h2>
      <EventsList />
    </>
  );
};

export default EventsPage;
