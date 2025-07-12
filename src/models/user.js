const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 40,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 40,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 256,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid Email');
        }
      },
    },
    password: {
      type: String,
      requried: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Not a strong password');
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message: `{VALUE} is invalid gender`,
      },
    },
    imageUrl: {
      type: String,
      default:
        'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Invalid Photo URL');
        }
      },
    },
    about: {
      type: String,
      default: 'This is a default about of the user',
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user?._id }, '@Satyam$Tinder', {
    expiresIn: '7d',
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const passwordHash = user?.password;
  const isValidPassword = await bcrypt.compare(passwordByUser, passwordHash);

  return isValidPassword;
};

module.exports = mongoose.model('Users', userSchema);
