const mongoose = require('mongoose');
const Channel = mongoose.model('Channel');
const Joi = require('joi');
const { asyncMiddleware } = require('../utils/async');
const User = require('../models/User');

/*
  GET /channel/:id
 */
const getChannelData = asyncMiddleware(async (req, res, next) => {
  try {
    const channelData = await Channel.findOne({
      member: {
        $elemMatch: { _id: req.payload._id },
      },
    }).exec();

    if (!channelData) {
      return res.status(409).send({ message: 'Channel Code error' });
    }

    res.status(200).json({
      message: 'get channel success',
      channel: channelData,
    });
  } catch (err) {
    return res.status(500).send({ message: 'get Channel Fail, try again' });
  }
});

/*
  POST /channel/create
 */
const createChannel = asyncMiddleware(async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(1).required(),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(422).send({ message: result.error.message });
  }

  const { name } = req.body;

  const channel = new Channel({
    name,
    createBy: req.payload._id,
    member: [
      {
        _id: req.payload._id,
      },
    ],
  });

  try {
    await channel.save();
  } catch (err) {
    return res.status(500).send({ message: 'create channel Fail' });
  }

  res.status(201).json({
    name,
    message: 'Create New Channel',
  });
});

/*
  POST /channel/invite
 */
const inviteUserInThisChannel = asyncMiddleware(async (req, res, next) => {
  const { channelId, invitedUserId } = req.body;
  const inviterId = req.payload._id;

  const query = { _id: channelId, member: [{ _id: inviterId }] };

  // 초대 권한이 있는 사람인가?
  try {
    const inviterAuth = Channel.find(query);
    console.log(inviterAuth);
    if (!inviterAuth) {
      return res.status(401).send({ message: 'inviter auth error' });
    }
    return res.status(200).json({ message: '안에 있음' });
  } catch (err) {
    return res.status(500).send({ message: 'invite User Fail' });
  }
});

exports.getChannelData = getChannelData;
exports.createChannel = createChannel;
exports.inviteUserInThisChannel = inviteUserInThisChannel;
