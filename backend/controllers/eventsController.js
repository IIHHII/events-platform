const { getEventsFromAPI, createEventInAPI } = require("../models/eventsModel");

const getEvents = (req, res) => {
  getEventsFromAPI()
    .then(events => res.json(events))
    .catch(err => res.status(500).json({ message: err.message }));
};

const createEvent = (req, res) => {
  createEventInAPI(req.body)
    .then(newEvent => res.status(201).json(newEvent))
    .catch(err => res.status(400).json({ message: err.message }));
};

module.exports = { getEvents, createEvent };
