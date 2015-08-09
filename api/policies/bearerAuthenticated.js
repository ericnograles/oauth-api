var passport = require('passport');

module.exports = function(req, res, next) {
  return passport.authenticate('bearer', {failureRedirect: '/auth/error', session: false}, function(err, user) {
    if (err || !user) {
      // If using a SPA, redirect to the login page
      return res.send(401, {error: 'Expired token'});
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};