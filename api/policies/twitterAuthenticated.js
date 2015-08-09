var passport = require('passport');

module.exports = function(req, res, next) {
  return passport.authenticate('twitter', {failureRedirect: '/auth/error'}, function(err, user) {
    if (err) {
      // If using a SPA, redirect to the login page
      return res.send(401, {error: 'Failed or cancelled Twitter auth'});
    } else {
      req.user = user;
      return next();
    }
  })(req, res, next);
};