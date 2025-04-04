const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
