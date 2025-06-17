const validator = require('validator');

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

module.exports = { isValidRequest };
