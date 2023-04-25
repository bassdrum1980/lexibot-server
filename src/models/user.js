import mongoose from 'mongoose';
import crypto from 'node:crypto';

// user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      max: 64,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: String,
      default: 'subscriber',
    },
    resetPasswordLink: {
      data: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

// virtual
userSchema
  .virtual('password')
  .set(function (password) {
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this.hashedPassword;
  });

// methods
userSchema.methods = {
  authenticate: function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
  },
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      return '';
    }
  },
  makeSalt: function () {
    return String(Math.round(new Date().valueOf() * Math.random()));
  },
};

const User = mongoose.model('User', userSchema);
export default User;
