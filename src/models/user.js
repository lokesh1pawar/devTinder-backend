const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Not a valid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error('Not a Strong Password');
        }
      },
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{values} is not a correct gender`
      }
    },
    photoUrl: {
      type: String,
      default:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdNJpoy5wyvZm0l7Yo4klqC6PY2dhw4foiZLnk5EQ0L1CLMEZwa95ZhLMHRb3nN39GHeg&usqp=CAU',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('Not a valid URL');
        }
      },
    },
    about: {
      type: String,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function (){
  const user = this;

  const token = await jwt.sign({ _id: user.id }, 'DEV@tin12', {expiresIn : "7d"});

  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
}

module.exports = mongoose.model('User', userSchema);