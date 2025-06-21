const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');

requestRouter.post('/sendrequest', userAuth, async (req, res) => {
  try {
    res.send(
      `Connection Request sent by ${req?.user?.firstName} ${req?.user?.lastName}`
    );
  } catch (error) {
    res.status(400).send('ERROR: ' + err?.message);
  }
});

module.exports = requestRouter;
