const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./config/passport');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax', 
  },
}));

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);

const eventsRoutes = require('./routes/eventsRoutes');
app.use('/api/events', eventsRoutes);

const googleCalendarRoutes = require('./routes/calendarRoutes');
app.use('/api/google/calendar', googleCalendarRoutes);

app.get('/api/auth/me', (req, res) => {
  if (req.user) {
    res.json({ isLoggedIn: true, role: req.user.role });
  } else {
    res.json({ isLoggedIn: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});