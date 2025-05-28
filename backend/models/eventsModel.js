const db = require('../db');

async function getAllEvents() {
  return db.query(
    'SELECT id, title, date_time AS "dateTime", location, description FROM events ORDER BY date_time ASC'
  );
}

async function createEvent({ title, dateTime, location, description }) {
  return db.query(
    `INSERT INTO events (title, date_time, location, description)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, date_time AS "dateTime", location, description`,
    [title, dateTime, location, description]
  );
}

async function updateEvent(id, { title, dateTime, location, description }) {
  return db.query(
    `UPDATE events
     SET title = $1, date_time = $2, location = $3, description = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING id, title, date_time AS "dateTime", location, description`,
    [title, dateTime, location, description, id]
  );
}

async function deleteEvent(id) {
  return db.query('DELETE FROM events WHERE id = $1', [id]);
}

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
};