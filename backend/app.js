import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import './config/passport';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'https://events-frontend-bduu.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
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
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/authRoutes'));

app.use('/api/google/calendar', require('./routes/calendarRoutes'));
app.use('/api/events', require('./routes/eventsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/api/auth/me', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ isLoggedIn: true, role: req.user.role });
  }
  return res.json({ isLoggedIn: false });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
