const router = require('express').Router();
const { ensureAuthenticated, addEvent } = require('../controllers/calendarController');

router.post('/add-event', ensureAuthenticated, addEvent);

module.exports = router;
