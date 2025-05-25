const db = require('../db');

// GET /api/events
async function getEvents(req, res) {
  try {
    const { rows } = await db.query(
      'SELECT id, title, date_time AS "dateTime", location, description FROM events ORDER BY date_time ASC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/events
async function createEvent(req, res) {
  const { title, dateTime, location, description } = req.body;
  try {
    const insertSQL = `
      INSERT INTO events (title, date_time, location, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, date_time AS "dateTime", location, description
    `;
    const { rows } = await db.query(insertSQL, [title, dateTime, location, description]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/events/:id
async function updateEvent(req, res) {
  const { id } = req.params;
  const { title, dateTime, location, description } = req.body;
  try {
    const updateSQL = `
      UPDATE events
      SET title = $1, date_time = $2, location = $3, description = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, title, date_time AS "dateTime", location, description
    `;
    const { rows } = await db.query(updateSQL, [title, dateTime, location, description, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /api/events/:id
async function deleteEvent(req, res) {
  const { id } = req.params;
  try {
    const { rowCount } = await db.query('DELETE FROM events WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Event not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };