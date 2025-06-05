import React from 'react';
import '../styles/eventsForm.css';

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

const EventForm = ({
  formData,
  handleChange,
  handleSubmit,
  submitting,
  error,
  heading,
  submitButtonText
}) => {
  return (
    <div className="event-form-container">
      <h2>{heading}</h2>
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
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
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
          <span>Image (optional):</span>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? `${submitButtonText}…` : submitButtonText}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
