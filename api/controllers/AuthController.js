var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	twitter: passport.authenticate('twitter'),
  login: login,
  register: register,
  error: error
};

function error(req, res) {
  return res.send(401, {message: 'Oh NOES, you are not authenticated or cancelled! Try to sign in user Twitter using GET /auth/twitter or POST a {email: \'someEmail\', password: \'somePassword\' to /auth/login}. In a SPA architecture, you would probably redirect back to the login page from this endpoint.'});
}

function login(req, res) {
  return res.json(req.user);
}

function register(req, res) {
  if (req.method === 'POST') {
    // All this junk below would probably be separated into a business logic layer or worker
    var validationErrors = [];
    var dto = req.body;
    if (!dto) {
      validationErrors.push('No user was defined');
      return res.send(400, {error: validationErrors.join('. ')});
    } else {
      if (!dto.email) {
        validationErrors.push('Email address is required');
      }
      if (!dto.password) {
        // Enforce your password policy here
        validationErrors.push('Password is required');
      }
      if (validationErrors.length > 0) {
        return res.send(400, {error: validationErrors.join('. ')});
      } else {
        User.create({email: dto.email})
          .exec(function(err, existingUser) {
            if (err || !existingUser) {
              return res.serverError(err || 'We had a problem creating the user');
            }  else {
              bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(dto.password, salt, function(err, hash) {
                  existingUser.password = hash;
                  existingUser.access_token = jwt.sign(existingUser, process.env.APP_BEARER_SECRET, {expiresInMinutes: 60});
                  existingUser.save(function(err) {
                    return res.json(existingUser.toJSON());
                  });
                });
              });

            }
          });
      }
    }
  } else {
    return res.serverError({error: 'Unexpected method call'});
  }
}