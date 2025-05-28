const express = require('express');
const router = express.Router();

const {
  ensureAuthenticated,
  addEvent
} = require('../controllers/calendarController');

router.post('/add-event', ensureAuthenticated, addEvent);

module.exports = router;
