const { google } = require('googleapis');
const { getUserById, updateUserTokens } = require('../models/userModel');

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}

async function addEvent(req, res) {
  try {
    const { title, dateTime } = req.body;
    const userId = req.user.id;

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
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
    const eventResource = {
      summary: title,
      start: { dateTime, timeZone: 'UTC' },
      end: { dateTime, timeZone: 'UTC' },
    };
    await calendar.events.insert({
      calendarId: 'primary',
      resource: eventResource,
    });

    return res.json({ success: true, message: 'Event added to Google Calendar' });
  } catch (error) {
    const errData = error?.response?.data;
    if (errData && errData.error === 'invalid_grant') {
      try {
        await updateUserTokens(req.user.id, null, null);
        console.warn(`Cleared expired Google tokens for user ${req.user.id}`);
      } catch (dbErr) {
        console.error('Error clearing tokens from DB:', dbErr);
      }
      return res
        .status(401)
        .json({ error: 'Google token expired or revoked. Please re-authenticate.' });
    }

    console.error('Google Calendar API error:', error.message || error.toString());
    return res.status(500).json({ error: 'Failed to add event to calendar' });
  }
}

module.exports = {
  ensureAuthenticated,
  addEvent,
};
