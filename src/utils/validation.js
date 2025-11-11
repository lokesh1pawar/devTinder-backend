const validator = require('validator');

const validationForSignUp = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if(!firstName || !lastName ) {
        throw new Error("Pls enter valid Name!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Pls enter valid Email!');
    } else if(!validator.isStrongPassword(password)) {
        throw new Error('Pls enter Strong Password!');
    }
};

const validateEditProfileData = (req) => {
    const allowedEditProfile = [
      'firstName',
      'lastName',
      'emailId',
      'age',
      'gender',
      'photoUrl',
      'about',
      'skills'
    ];

    const isEditAllowed = Object.keys(req.body).every((feild) =>
      allowedEditProfile.includes(feild)
    );

    return isEditAllowed;
};

module.exports = { validationForSignUp, validateEditProfileData };