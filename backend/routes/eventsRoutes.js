const router = require('express').Router();
const multer = require('multer');
const { ensureStaff } = require('../controllers/authController');
const eventsRoutes = require('../controllers/eventsController');

const upload = multer({
  storage: multer.memoryStorage(),
});

router.get('/', eventsRoutes.getEvents);
router.get('/:id', eventsRoutes.getEventById);

router.post('/', upload.single('image'), eventsRoutes.createEvent);
router.post('/bulk', ensureStaff, eventsRoutes.createBulkEvents);
router.put('/:id', upload.single('image'), ensureStaff, eventsRoutes.updateEvent);
router.delete('/:id', ensureStaff, eventsRoutes.deleteEvent);

module.exports = router;
