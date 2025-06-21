const express = require('express');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileRequest } = require('../utils/validations');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    res.send(req?.user);
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    const invalidEditRequestDetails = validateEditProfileRequest(req);
    if (invalidEditRequestDetails.length > 0) {
      throw new Error(
        `You can't edit these fields: ${invalidEditRequestDetails}`
      );
    }

    const loggedInUser = req.user;

    Object.keys(req?.body).forEach((key) => {
      loggedInUser[key] = req?.body?.[key];
    });

    await loggedInUser.save();

    res.send(`Hey ${loggedInUser?.firstName}!! Your edit was successful`);
  } catch (err) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

module.exports = profileRouter;
