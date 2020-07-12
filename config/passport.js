const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load User model
const User = require('../models/User');
const { authenticate } = require('passport');
const { stat } = require('fs');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' },(email, password,done) => {
      // Match user
      User.findOne({
        email: email,
        //stat:'Staff'
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Your e-mail is not registered.'});
        }
        if (user.stat != 'Staff') {
          return done(null, false, { message: "You don't have the permission to access this page"});
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
            
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
        });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};