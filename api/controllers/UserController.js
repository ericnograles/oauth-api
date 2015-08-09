var Twit = require('twit');
/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	profile: profile,
  tweets: tweets
};

function profile(req, res) {
  // All this junk below would probably be separated into a business logic layer or worker
  if (req.method === 'GET') {
    User.findOne(req.query)
      .exec(function(err, existingUser) {
        if (err || !existingUser) {
          return res.send(401, {error: err || 'User not found'});
        } else {
          return res.json(existingUser.toJSON());
        }
      });
  } else {
    return res.serverError({error: 'Unexpected method call'});
  }
}

function tweets(req, res) {
  // All this junk below would probably be separated into a business logic layer or worker
  if (req.method === 'GET') {
    User.findOne(req.query)
      .exec(function(err, existingUser) {
        if (err || !existingUser) {
          return res.send(401, {error: err || 'User not found'});
        } else {
          var twitterToken = existingUser.oAuthTokens['Twitter'];
          var twitterClient = new Twit({
            consumer_key: process.env.TWITTER_APP_ID,
            consumer_secret: process.env.TWITTER_APP_SECRET,
            access_token: twitterToken.token,
            access_token_secret: twitterToken.tokenSecret
          });

          twitterClient.get('statuses/user_timeline', {screen_name: existingUser.twitterUsername}, function(err, data, response) {
            if (err) {
              return res.serverError(err);
            } else {
              return res.json(data);
            }
          });
        }
      });
  } else {
    return res.serverError({error: 'Unexpected method call'});
  }
}

