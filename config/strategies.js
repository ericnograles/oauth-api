var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var _ = require('lodash');
var TwitterStrategy = require('passport-twitter').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var LocalStrategy = require('passport-local').Strategy;

/**
 * Issues a new JSON Web token with a 60 minute expiry
 * @param {Object} userProfileToDecode
 */
function createNewToken(userProfileToDecode) {
  return jwt.sign(userProfileToDecode, process.env.APP_BEARER_SECRET, {expiresInMinutes: 60});
}

var twitter = new TwitterStrategy({
    consumerKey: process.env.TWITTER_APP_ID,
    consumerSecret: process.env.TWITTER_APP_SECRET,
    callbackURL: 'http://127.0.0.1:1337/twitter/callback'
  },
  function(token, tokenSecret, userProfile, done) {
    User.findOrCreate({twitterUsername: userProfile.username})
      .exec(function findOrCreateUserByTwitterUsername(err, user) {
        var userProfileForToken = user.toJSON();
        // Refresh the Twitter oAuthToken
        if (!user.oAuthTokens) {
          user.oAuthTokens = {};
        }
        user.oAuthTokens['Twitter'] = {token: token, tokenSecret: tokenSecret};

        // Issue a new bearer token for the app if one does not exist or it has expired
        if (!user.access_token) {
          user.access_token = createNewToken(userProfileForToken);
          user.save(function(err) {
            done(err, user);
          });
        } else {
          // Issue a new bearer token if the current one is expired
          jwt.verify(user.access_token, process.env.APP_BEARER_SECRET, function(err, decoded) {
            if (err) {
              user.access_token = createNewToken(userProfileForToken);
              user.save(function(err) {
                done(err, user);
              });
            } else {
              // Et voila!
              user.save(function(err) {
                done(err, user);
              });
            }
          });
        }
      });
  });

var bearer = new BearerStrategy(
  function(token, done) {
    User.findOne({access_token: token})
      .exec(function findUserByBearerToken(err, existingUser) {
        if (err || !existingUser) {
          return done(err || 'User not authenticated');
        } else {
          // Verify that the token still is good
          jwt.verify(existingUser.access_token, process.env.APP_BEARER_SECRET, function(err, decoded) {
            return done(err, existingUser);
          });
        }
      });
  }
);

var local = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, function(email, password, done) {
  User.findOne({email: email})
    .exec(function findUserByEmail(err, existingUser) {
      if (err || !existingUser) {
        return done(err || 'User does not exist');
      } else {
        bcrypt.compare(password, existingUser.password, function verifyPassword(err, isMatched) {
          if (err || !isMatched) {
            return done(err || 'Incorrect password');
          } else {
            // Clone the user object and remove any sensitive data
            var userProfileForToken = existingUser.toJSON();
            // Persist the token for later usage
            existingUser.access_token = createNewToken(userProfileForToken);
            existingUser.save(function(err) {
              return done(err, existingUser);
            });
          }
        });
      }
    });
});

module.exports = {
  twitter: twitter,
  bearer: bearer,
  local: local
};

