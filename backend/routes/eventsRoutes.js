const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { ensureStaff } = require('../controllers/authController');
const eventsRoutes = require('../controllers/eventsController');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname,'../uploads')),
    filename:    (req, file, cb) => cb(null, Date.now()+path.extname(file.originalname))
  })
});

router.get('/', eventsRoutes.getEvents);
router.get('/:id', eventsRoutes.getEventById);
router.post('/', upload.single('image'), ensureStaff, eventsRoutes.createEvent);
router.post('/bulk', ensureStaff, eventsRoutes.createBulkEvents);
router.put('/:id', upload.single('image'), ensureStaff, eventsRoutes.updateEvent);
router.delete('/:id', ensureStaff, eventsRoutes.deleteEvent);

module.exports = router;
