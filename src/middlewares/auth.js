const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookie
    const { token } = req.cookies;
    if(!token) {
      res.status(401).send('Unauthorized: Please login first');
    }
    const decodedObj = await jwt.verify(token, 'DEV@tin12');

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error('User not found!');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send('ERROR: ' + error.message);
  }
};

module.exports = { userAuth };