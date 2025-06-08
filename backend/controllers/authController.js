const passport = require('passport');

exports.googleAuth = (req, res, next) =>
  passport.authenticate('google', {
    scope: [
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar.events'
    ],
    accessType: 'offline',
    prompt: 'consent'
  })(req, res, next);

  exports.googleAuthCallback = (req, res, next) =>
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` })(req, res, () => {
      res.redirect(`${process.env.FRONTEND_URL}/`);
    });
  

exports.logout = (req, res) =>
  req.logout(() => res.redirect(`${process.env.FRONTEND_URL}`));

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: 'Not authenticated' });
};

exports.ensureStaff = (req, res, next) => {
  if (!(req.isAuthenticated && req.isAuthenticated()))
    return res.status(401).json({ error: 'Unauthorized' });
  if (req.user.role !== 'staff')
    return res.status(403).json({ error: 'Staff only' });
  next();
};
