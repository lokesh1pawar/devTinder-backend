const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const {validateEditProfileData} = require('../utils/validation');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { validate } = require('../models/user');


// Get profile view
profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error('User does not exist');
    }

    res.send(user);
  } catch (err) {
    res.status(400).send('Something went wrong!');
  }
});

// Profile edit
profileRouter.patch('/profile/edit',userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid Edit request");
    }
      const loggedInUsers = req.user;
      
      Object.keys(req.body).forEach((key) => 
        (
          loggedInUsers[key]  = req.body[key])
        );

        await loggedInUsers.save();

        res.json({ message: `${loggedInUsers.firstName}, your profile updated successfully`, data:loggedInUsers});

  } catch (error) {
    res.status(400).send('Something went wrong!'); 
  }
});

// Profile edit password 
profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
      // Get data from client - POSTMAN
      const {
        inputPassword, 
        newPassword,
      } = req.body;

      const user = req.user;
      const userPass = user.password; 
      
      // check if input password is valid or not
      const validatePassword = await bcrypt.compare(inputPassword, userPass);
      if (!validatePassword) {
        throw new Error('Incorrect current password');
      } else {
          if(!validator.isStrongPassword(newPassword)) {
            throw new Error('Pls enter Strong Password!');
          }
           // Encrypt the password
              const saltRounds = 10;
              const passwordHash = await bcrypt.hash(newPassword, saltRounds);
            user.password = passwordHash;
             await user.save();
      }

      res.json({ message: 'Password Changed successfully!' });
    } catch (error) {
    res.status(400).send("ERROR: " + error); 

    }
});

module.exports = { profileRouter };