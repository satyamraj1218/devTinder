const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');

const { isValidRequest } = require('../utils/validations');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
  try {
    //validate the request
    isValidRequest(req?.body);

    const { firstName, lastName, emailId, password } = req?.body;

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send('User added successfully');
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error('Invalid Credentials');
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid Credentials');
    } else {
      //creating a jwt token
      const token = await user.getJWT();

      //Adding the token to cookie and send the response back to the server
      res.cookie('token', token);
      res.send('Login successful!!!');
    }
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

authRouter.post('/logout', (req, res) => {
  res
    .cookie('token', null, { expires: new Date(Date.now()) })
    .send('Logged Out Successfully');
});

module.exports = authRouter;
