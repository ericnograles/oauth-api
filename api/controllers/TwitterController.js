var passport = require('passport');

/**
 * TwitterController
 *
 * @description :: Server-side logic for managing twitters
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	callback: callback
};

function callback(req, res) {
  var access_token = req.user.access_token;
  return res.json({message: 'Welcome back! At this point in the SPA, you would probably redirect back to the SPA with an access_token that it can then use for subsequent requests using the bearer strategy',
  access_token: access_token});
}
