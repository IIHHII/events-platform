const EventModel = require('../models/eventsModel');
const db = require('../db');

async function getEvents(req, res) {
  try {
    const filters = {
      category: req.query.category,
      location: req.query.location,
      date: req.query.date
    };
    const { rows } = await EventModel.getAllEvents(filters);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await EventModel.getEventById(id);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createEvent(req, res) {
  try {
    const { title, dateTime, location, category, description } = req.body;
    if (!category || category.trim() === '') {
      return res.status(400).json({ error: 'Category is required' });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { rows } = await EventModel.createEvent({ title, dateTime, location, category, description, imageUrl });
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, dateTime, location, category, description } = req.body;
    const { rows } = await EventModel.updateEvent(id, { title, dateTime, location, category, description, imageUrl });
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const result = await EventModel.deleteEvent(id);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Event not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createBulkEvents(req, res) {
  const { events } = req.body;

  if (!Array.isArray(events)) {
    return res.status(400).json({ error: 'Expected an array of events' });
  }

  const isValid = events.every(
    (e) => e.title && e.date_time && e.location && e.category
  );

  if (!isValid) {
    return res.status(400).json({
      error: 'Each event must include title, date_time, location, and category',
    });
  }

  try {
    const insertedEvents = await insertBulkEvents(events);
    res.status(201).json(insertedEvents);
  } catch (error) {
    console.error('Bulk insert failed:', error);
    res.status(500).json({ error: 'Bulk insert failed' });
  }
}


module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createBulkEvents
};
