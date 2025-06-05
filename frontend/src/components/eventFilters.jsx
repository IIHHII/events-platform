import React from 'react';
import '../styles/eventFilters.css';


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

const EventFilters = ({ filters, onFilterChange, onFilterSubmit, uniqueLocations }) => {
  return (
    <form className="filter-container" onSubmit={onFilterSubmit}>
      <select name="category" value={filters.category} onChange={onFilterChange}>
        <option value="">All Categories</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select name="location" value={filters.location} onChange={onFilterChange}>
        <option value="">All Locations</option>
        {uniqueLocations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <input type="date" name="date" value={filters.date} onChange={onFilterChange} />
      <button type="submit">Apply Filters</button>
    </form>
  );
};

export default EventFilters;
