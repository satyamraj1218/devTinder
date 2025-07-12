const express = require('express');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const { validateEditProfileRequest } = require('../utils/validations');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    return res.send(req?.user);
  } catch (err) {
    return res.status(400).send('ERROR: ' + err?.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    const invalidEditRequestDetails = validateEditProfileRequest(req);
    if (invalidEditRequestDetails.length > 0) {
      throw new Error(`You can't edit these fields: ${invalidEditRequestDetails}`);
    }

    const loggedInUser = req.user;

    Object.keys(req?.body).forEach((key) => {
      loggedInUser[key] = req?.body?.[key];
    });

    await loggedInUser.save();

    return res.json({
      message: `Hey ${loggedInUser?.firstName}!! Your edit was successful`,
      data: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send('ERROR: ' + err?.message);
  }
});

module.exports = profileRouter;
