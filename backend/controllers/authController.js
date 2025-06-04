const passport = require('passport');

function googleAuth(req, res, next) {
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    accessType: 'offline',
    prompt: 'consent'
  })(req, res, next);
}

function googleAuthCallback(req, res, next) {
  passport.authenticate('google', { failureRedirect: '/login' })(req, res, function() {
    const role = req.user.role;
    const redirectUrl = role === 'staff'
      ? 'http://localhost:3000/staff'
      : 'http://localhost:3000/';
    res.redirect(redirectUrl);
  });
}

function logout(req, res) {
  req.logout(() => {
    res.redirect('http://localhost:3000');
  });
}

function ensureStaff(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized: Please log in' });
  }
  if (!req.user || req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Forbidden: Staff access only' });
  }
  next();
}

module.exports = {
  googleAuth,
  googleAuthCallback,
  logout,
  ensureStaff,
};
