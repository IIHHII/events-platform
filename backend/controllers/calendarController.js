const { google } = require('googleapis');
const { getUserById, updateUserTokens } = require('../models/userModel');

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

exports.addEvent = async (req, res) => {
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

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    oAuth2Client.setCredentials({
      access_token:  user.access_token,
      refresh_token: user.refresh_token,
    });

    oAuth2Client.on('tokens', (tokens) => {
      const newAccess = tokens.access_token || user.access_token;
      const newRefresh = tokens.refresh_token || user.refresh_token;
      updateUserTokens(userId, newAccess, newRefresh).catch(console.error);
    });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    await calendar.events.insert({
      calendarId: 'primary',
      resource: {
        summary: title,
        start: { dateTime, timeZone: 'UTC' },
        end:   { dateTime, timeZone: 'UTC' },
      },
    });

    res.json({ success: true, message: 'Event added to Google Calendar' });
  } catch (error) {
    const errData = error?.response?.data;
    if (errData?.error === 'invalid_grant') {
      await updateUserTokens(req.user.id, null, null).catch(console.error);
      console.warn(`Cleared expired tokens for user ${req.user.id}`);
      return res
        .status(401)
        .json({ error: 'Tokens expired. Please re-authenticate.' });
    }

    console.error('Google Calendar API error:', error);
    res.status(500).json({ error: 'Failed to add event to calendar' });
  }
};