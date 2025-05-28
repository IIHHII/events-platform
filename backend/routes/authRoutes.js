const express = require('express');
const router = express.Router();

const {
  googleAuth,
  googleAuthCallback,
  logout,
} = require('../controllers/authController');

router.get('/auth/google', googleAuth);

router.get('/auth/google/callback', googleAuthCallback);

router.get('/auth/logout', logout);

module.exports = router;
