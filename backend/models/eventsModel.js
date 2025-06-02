const db = require('../db');

async function getAllEvents(filters = {}) {
  const { category, location, date } = filters;
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`category ILIKE $${values.length}`);
  }

  if (location) {
    values.push(location);
    conditions.push(`location ILIKE $${values.length}`);
  }

  if (date) {
    values.push(date);
    conditions.push(`DATE(date_time) = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT id, title, date_time AS "dateTime", location, category, description, image_url AS "imageUrl"
    FROM events
    ${whereClause}
    ORDER BY date_time ASC
  `;

  return db.query(query, values);
}

async function getEventById(id) {
  return db.query(
    'SELECT id, title, date_time AS "dateTime", location, category, description, image_url AS "imageUrl" FROM events WHERE id = $1',
    [id]
  );
}

async function createEvent({ title, dateTime, location, category, description, imageUrl }) {
  return db.query(
    `INSERT INTO events (title, date_time, location, category, description, image_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, title, date_time AS "dateTime", location, category, description, image_url AS "imageUrl"`,
    [title, dateTime, location, category, description, imageUrl]
  );
}

async function updateEvent(id, { title, dateTime, location, category, description, imageUrl }) {
  return db.query(
    `UPDATE events
     SET title = $1, date_time = $2, location = $3, category = $4, description = $5, image_url = COALESCE($6, image_url), updated_at = NOW()
     WHERE id = $7
     RETURNING id, title, date_time AS "dateTime", location, category, description, image_url AS "imageUrl"`,
    [title, dateTime, location, category, description, imageUrl, id]
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
