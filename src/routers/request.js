const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req?.user?._id;
    const toUserId = req?.params?.toUserId;
    const status = req?.params?.status;

    const allowedStatus = ['interested', 'ignored'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status type: ' + status });
    }

    const isDuplicateConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (isDuplicateConnectionRequest) {
      return res.status(400).json({ message: 'The connection request already exists' });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: 'User not found!!' });
    }

    const connectionRequestData = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequestData.save();

    res.json({
      message:
        status === 'interested'
          ? `${req?.user?.firstName} is ${status} in ${toUser?.firstName}`
          : `${req?.user?.firstName} ${status} ${toUser?.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).send('ERROR: ' + error?.message);
  }
});

module.exports = requestRouter;
