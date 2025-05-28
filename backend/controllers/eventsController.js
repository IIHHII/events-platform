const EventModel = require('../models/eventsModel');

async function getEvents(req, res) {
  try {
    const { rows } = await EventModel.getAllEvents();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createEvent(req, res) {
  try {
    const { rows } = await EventModel.createEvent(req.body);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await EventModel.updateEvent(id, req.body);
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
  createEvent,
  updateEvent,
  deleteEvent
};
