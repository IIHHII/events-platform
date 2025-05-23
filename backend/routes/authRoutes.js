const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/auth/google',
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    accessType: 'offline',
    prompt: 'consent'
  })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000');
  }
);

router.get('/auth/logout', (req, res) => {
    req.logout(() => {
      res.redirect('http://localhost:3000');
    });
  });
  

module.exports = router;
