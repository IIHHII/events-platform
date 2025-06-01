const db = require('../db');

async function getAllEvents() {
  return db.query(
    'SELECT id, title, date_time AS "dateTime", location, description, image_url AS "imageUrl" FROM events ORDER BY date_time ASC'
  );
}

async function getEventById(id) {
  return db.query(
    'SELECT id, title, date_time AS "dateTime", location, description, image_url AS "imageUrl" FROM events WHERE id = $1',
    [id]
  );
}

async function createEvent({ title, dateTime, location, description, imageUrl }) {
  return db.query(
    `INSERT INTO events (title, date_time, location, description, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, date_time AS "dateTime", location, description, image_url AS "imageUrl"`,
    [title, dateTime, location, description, imageUrl]
  );
}

async function updateEvent(id, { title, dateTime, location, description, imageUrl }) {
  return db.query(
    `UPDATE events
     SET title = $1, date_time = $2, location = $3, description = $4, image_url = COALESCE($5, image_url), updated_at = NOW()
     WHERE id = $6
     RETURNING id, title, date_time AS "dateTime", location, description, image_url AS "imageUrl"`,
    [title, dateTime, location, description, imageUrl, id]
  );
}

async function deleteEvent(id) {
  return db.query('DELETE FROM events WHERE id = $1', [id]);
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
