import React from 'react';
import EventForm from '../components/eventsForm';
import '../styles/eventsForm.css';

const AddEventPage = ({ isLoggedIn }) => {
  return (
    <>
      {isLoggedIn ? <EventForm /> : <p>Please sign in to add events.</p>}
    </>
  );
};


export default AddEventPage;
