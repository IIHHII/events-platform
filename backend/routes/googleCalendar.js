const express = require('express');
const { google } = require('googleapis');
const router = express.Router();

const { getUserById, updateUserTokens } = require('../controllers/userController');

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
}

router.post('/add-event', ensureAuthenticated, async (req, res) => {
  try {
    const { eventId, title, dateTime } = req.body;
    const userId = req.user.id;

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.access_token || !user.refresh_token) {
      return res.status(400).json({ error: 'Google tokens missing' });
    }

    const oAuth2Client = getOAuth2Client();
    oAuth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
    });

    oAuth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        updateUserTokens(userId, tokens.access_token, tokens.refresh_token);
      } else if (tokens.access_token) {
        updateUserTokens(userId, tokens.access_token, user.refresh_token);
      }
    });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary: title,
      start: {
        dateTime: dateTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: dateTime,
        timeZone: 'UTC',
      },
    };

    await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.json({ success: true, message: 'Event added to Google Calendar' });

  } catch (error) {
    console.error('Google Calendar API error:', error);
    res.status(500).json({ error: 'Failed to add event to calendar' });
  }
});

module.exports = router;

