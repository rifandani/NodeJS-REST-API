const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

// auth user login
exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get user by email
      const user = await User.findOne({ email: email });

      // match with the password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          // password match dgn di database
          resolve(user);
        } else {
          // password not match dgn di database
          reject('Password not match');
        }
      });
    } catch (err) {
      // email not found
      reject('Auth failed');
    }
  });
};
