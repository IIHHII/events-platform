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

module.exports = {
  googleAuth,
  googleAuthCallback,
  logout,
};
