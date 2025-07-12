const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const DATA_SAFE = 'firstName lastName age gender about skills imageUrl';

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsReceived = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', DATA_SAFE);

    return res.json({ message: 'Requests fetched successfully', data: requestsReceived });
  } catch (error) {
    return res.status(400).send('ERROR: ' + error?.message);
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

    return res.json({ data });
  } catch (error) {
    return res.status(400).send('ERROR: ' + error?.message);
  }
});

userRouter.get('/feed', userAuth, async (req, res) => {
  try {
    const page = parseInt(req?.query?.page) || 1;
    let limit = parseInt(req?.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const feedDetails = await User.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(DATA_SAFE);

    const updatedFeedDetails = await Promise.all(
      feedDetails.map(async (el) => {
        const statusCheck = await ConnectionRequest.exists({
          $or: [
            {
              fromUserId: loggedInUser?._id,
              toUserId: el?._id,
              status: { $in: ['accepted', 'rejected', 'interested', 'ignored'] },
            },
            {
              fromUserId: el?._id,
              toUserId: loggedInUser?._id,
              status: { $in: ['accepted', 'rejected', 'ignored'] },
            },
          ],
        });

        if (el?._id?.toString() === loggedInUser?._id?.toString() || !!statusCheck) {
          return '';
        }
        return el;
      })
    );

    const result = updatedFeedDetails?.filter((el) => el !== '');

    return res.json({ message: 'Feed fetched successfully', data: result });
  } catch (error) {
    return res.status(400).send('ERROR: ' + error?.message);
  }
});

module.exports = userRouter;
