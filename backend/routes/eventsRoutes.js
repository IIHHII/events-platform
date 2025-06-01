const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventsController');

const { ensureStaff } = require('../controllers/authController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

router.get('/', getEvents);
router.get('/:id', getEventById);

router.post('/', upload.single('image'), ensureStaff, createEvent);
router.put('/:id', upload.single('image'), ensureStaff, updateEvent);
router.delete('/:id', ensureStaff, deleteEvent);

module.exports = router;
