const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const user = require('../models/user');

// sending a connection request
requestRouter.post(
  '/request/send/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ['interested', 'ignored'];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status type ' + status,
        });
      }
      // find toUser is exist ?
      const toUserExist = await user.findById(toUserId);
      if (!toUserExist) {
        return res.status(400).json({ message: 'Sorry! User does not exist' });
      }

      // if there is an existing connection
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: 'Connection request already exist' });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      if (status == 'interested') {
        res.json({ message: 'connection req sent!', data });
      } else {
        res.json({ message: 'connection req ignored!', data });
      }
    } catch (err) {
      res.status(400).send('ERROR ' + err.message);
    }
  }
);

requestRouter.post(
  '/request/review/:status/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const isAllowedStatus = ['accepted', 'rejected'];
      if (!isAllowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `${status} is not allowed status` });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: 'interested',
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'connection request not found' });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: 'Connection request ' + status, data });
    } catch (error) {
      res.status(400).send('ERROR: ' + error.message);
    }
  }
);

module.exports = { requestRouter };
