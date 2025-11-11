const express = require('express');
const authRouter = express.Router();
const { validationForSignUp } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Signup User
authRouter.post('/signup', async (req, res) => {
  try {
    // Validate the data
    validationForSignUp(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    //  Creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('User created Successfully!');
  } catch (error) {
    res.status(400).send('Failed creating user :- ' + error.message);
  }
});

// Login User
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error('Invalid credential');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      // add the token to the cookie and send the responce back to user
      res.cookie('token', token);

      res.send(user);
    } else {
      throw new Error('Invalid credential');
    }
  } catch (error) {
    res.status(404).send('ERROR : ' + error.message);
  }
});

// Logout User
authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, {expires: new Date(Date.now())});
    res.send("Logout successfull!");
});

module.exports = { authRouter };