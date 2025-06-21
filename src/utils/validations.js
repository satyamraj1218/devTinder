const validator = require('validator');
const { bcrypt } = require('bcrypt');

const isValidRequest = (request) => {
  const { firstName, lastName, emailId, password } = request;

  if (!firstName || !lastName) {
    throw new Error('Invalid name!');
  }

  if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid. Check your email!');
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password!');
  }
};

const validateEditProfileRequest = (req) => {
  const allowedEdits = [
    'firstName',
    'lastName',
    'gender',
    'skills',
    'about',
    'imageUrl',
    'age',
  ];
  const isInvalidEditRequest = Object.keys(req?.body)?.filter(
    (key) => !allowedEdits.includes(key)
  );
  return isInvalidEditRequest;
};

validateOldPassword = async (passwordByUser, passwordHash) => {
  return await bcrypt.compare(passwordByUser, passwordHash);
};

module.exports = {
  isValidRequest,
  validateEditProfileRequest,
  validateOldPassword,
};
