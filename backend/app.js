require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

require('./config/passport.js');

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'https://events-frontend-bduu.onrender.com',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/authRoutes.js'));
app.use('/api/google/calendar', require('./routes/calendarRoutes.js'));
app.use('/api/events', require('./routes/eventsRoutes.js'));
app.use('/api/users', require('./routes/userRoutes.js'));

app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ isLoggedIn: true, role: req.user.role });
  }
  return res.json({ isLoggedIn: false });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
