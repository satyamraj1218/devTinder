const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();

const DATA_SAFE = 'firstName lastName age gender about skills imageUrl';

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', DATA_SAFE);

    res.json({ message: 'Requests fetched successfully', data: requestsReceived });
  } catch (error) {
    res.status(400).send('ERROR: ' + error?.message);
  }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionsData = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: 'accepted',
        },
        {
          fromUserId: loggedInUser._id,
          status: 'accepted',
        },
      ],
    })
      .populate('fromUserId', DATA_SAFE)
      .populate('toUserId', DATA_SAFE);

    const data = connectionsData.map((el) => {
      return el?.fromUserId?._id?.toString() === loggedInUser?._id?.toString()
        ? el?.toUserId
        : el?.fromUserId;
    });

    res.json({ data });
  } catch (error) {
    res.status(400).send('ERROR: ' + error?.message);
  }
});

module.exports = userRouter;
