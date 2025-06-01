const EventModel = require('../models/eventsModel');

async function getEvents(req, res) {
  try {
    const { rows } = await EventModel.getAllEvents();
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
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, dateTime, location, description } = req.body;
    const { rows } = await EventModel.createEvent({ title, dateTime, location, description, imageUrl });
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { title, dateTime, location, description } = req.body;
    const { rows } = await EventModel.updateEvent(id, { title, dateTime, location, description, imageUrl });
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

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
