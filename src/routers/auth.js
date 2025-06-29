const express = require('express');
const authRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

const { isValidRequest } = require('../utils/validations');
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');

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

authRouter.patch('/updatepassword', userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req?.body;
    //take an input for old password -> new password -> confirm new password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, req?.user?.password);

    if (!isOldPasswordValid) {
      throw new Error('Your old password is not correct');
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error(`Your passwords don't match`);
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error('Enter a strong password!!');
    }
    //convert the new password with password hash -> update the password hash in db
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const loggedInUser = req.user;
    loggedInUser.password = passwordHash;

    await loggedInUser.save();

    res.send(`Hey ${loggedInUser?.firstName}!! Your password was updated successfully`);
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

authRouter.post('/logout', (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()) }).send('Logged Out Successfully');
});

module.exports = authRouter;
