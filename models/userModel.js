const mongoose = require('mongoose');
const validator = require('validator');

const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    validate: {
      validator: function (value) {
        return specialCharRegex.test(value);
      },
      message: 'Password must contain at least one special character!',
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
