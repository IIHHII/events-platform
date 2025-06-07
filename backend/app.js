const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./config/passport');

require('dotenv').config();

const app = express();

app.use(cors({ origin:'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie: { secure:false, httpOnly:true, sameSite:'lax' }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/authRoutes'));
app.use('/api/google/calendar', require('./routes/calendarRoutes'));
app.use('/api/events', require('./routes/eventsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/api/auth/me', (req, res) => {
  res.json(req.user
    ? { isLoggedIn:true, role:req.user.role }
    : { isLoggedIn:false });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status||500).json({ error: err.message });
});

const PORT = process.env.PORT||5000;
app.listen(PORT,()=> console.log(`Running on http://localhost:${PORT}`));
