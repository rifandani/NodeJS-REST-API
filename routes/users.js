const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../auth');
const config = require('../config');

module.exports = (server) => {
  // register user
  server.post('/register', (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email: email,
      password: password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // hash password
        user.password = hash;
        // save user
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // auth user
  server.post('/auth', async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // auth user from auth.js
      const user = await auth.authenticate(email, password);
      // console.log(user);

      // create token == seperti @csrftoken di laravel
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m',
      });

      const { iat, exp } = jwt.decode(token);
      // response passing token - iat stands for issuedAt
      res.send({
        iat,
        exp,
        token,
      });

      next();
    } catch (err) {
      // user unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
