const { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, insertBulkEvents } = require('../models/eventsModel');
const uploadToSupabase = require('../utils/uploadToSupabase');

exports.getEvents = async (req, res) => {
  try {
    console.log("Received GET /api/events with filters:", req.query);

    const result = await getAllEvents(req.query);

    console.log("Events fetched successfully:", result.rows.length, "rows");

    res.json(result.rows);

  } catch (err) {
    console.error("Error in getEvents controller:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getEventById = async (req, res) => {
  const { id } = req.params;
  const { rows } = await getEventById(id);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
};

exports.createEvent = async (req, res) => {
  try {
    const { title, dateTime, location, category, description } = req.body;
    if (!category?.trim()) throw new Error('Category required');

    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToSupabase(req.file.buffer, req.file.mimetype, req.file.originalname);
      if (!imageUrl) throw new Error('Failed to upload image');
    }

    const { rows } = await createEvent({ title, dateTime, location, category, description, imageUrl });
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, dateTime, location, category, description } = req.body;

    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadToSupabase(req.file.buffer, req.file.mimetype, req.file.originalname);
      if (!imageUrl) throw new Error('Failed to upload image');
    }

    const { rows } = await updateEvent(id, { title, dateTime, location, category, description, imageUrl });
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  const result = await deleteEvent(id);
  if (!result.rowCount) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
};

exports.createBulkEvents = async (req, res) => {
  const { events } = req.body;
  if (!Array.isArray(events)) return res.status(400).json({ error: 'Array expected' });
  if (!events.every(e => e.title && e.date_time && e.location && e.category))
    return res.status(400).json({ error: 'Missing fields' });
  try {
    const rows = await insertBulkEvents(events);
    res.status(201).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
