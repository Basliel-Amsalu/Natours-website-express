const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'you must enter a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'name must be less than 40 characters'],
    minlength: [3, 'name must be more than 10 characters'],
  },
  email: {
    type: String,
    required: [true, 'you must enter email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please enter a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'must have password'],
    minlength: [8, 'password must be more than or equal to 8 characters'],
    select: false, // do not show in response object as it is sensitive data and should only
  },
  confirmPassword: {
    type: String,
    required: [true, 'please confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'the value you entered does not match the password you entered',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp < changedTimeStamp);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
