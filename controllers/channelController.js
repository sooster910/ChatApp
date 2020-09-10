const mongoose = require('mongoose');
const Channel = mongoose.model('Channel');
const Joi = require('joi');
const { asyncMiddleware } = require('../utils/async');

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
  {
    name: 'new channel name!',
  }
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
  {
    channelId: ObjectId,
    invitedUserId: ObjectId,
  }
  not end point
 */
// 사용할 필요가 없을 것 같은데..
const inviteUserInThisChannel = asyncMiddleware(async (req, res, next) => {
  const { channelId, invitedUserId } = req.body;
  const inviterId = req.payload._id;

  try {
    // channel 안에 초대한 user가 존재하는지 확인
    const inviterAuth = await Channel.findById({ _id: channelId })
      .findOne({
        member: { $elemMatch: { _id: inviterId } },
      })
      .lean();

    if (!inviterAuth) {
      return res.status(401).send({ message: 'inviter is not a member' });
    }

    // 이미 초대받은 명단에 있다면 초대하지 않고 넘어가자
    const inviteCheck = await Channel.findById({ _id: channelId })
      .findOne({ waitingUser: { $elemMatch: { _id: invitedUserId } } })
      .lean();

    if (inviteCheck) {
      // 일단 409로 두긴 했는데, 이미 있는 사용자라 해서 오류로 보낼지 덮어씌울지 고민해봐야겠음
      return res.status(409).send({ message: '이미 초대된 사용자' });
    }

    const result = await Channel.findByIdAndUpdate(
      channelId,
      { $addToSet: { waitingUser: { _id: invitedUserId } } },
      { new: true },
    ).exec();

    if (!result) {
      return res.status(404).send({ message: 'invite User Fail' });
    }

    return next();
    // return res.status(200).json({ message: 'invite sucess' });
  } catch (err) {
    return res.status(500).send({ message: 'Failed invite, internal Error' });
  }
});

/*
  POST /channel/leave
  {
    channelId: ObjectId,
  }
  not end point
 */
const leaveThisChannel = asyncMiddleware(async (req, res, next) => {
  const { channelId } = req.body;
  const userId = req.payload._id;

  try {
    await Channel.findByIdAndUpdate(
      channelId,
      {
        $pull: { member: { _id: userId } },
      },
      { new: true },
    ).exec();

    // return res.status(200).json({ message: 'leave Channel' });
    return next();
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'leave channel fail, internal Error' });
  }
});

/*
  POST /channel/join
  {
    channelId: ObjectId,
  }
  not end point
 */
const addMember = asyncMiddleware(async (req, res, next) => {
  const { channelId } = req.body;
  const userId = req.payload._id;

  try {
    await Channel.findByIdAndUpdate(
      channelId,
      {
        $addToSet: { member: { _id: userId } },
      },
      { new: true },
    ).exec();

    return next();
  } catch (err) {
    return res.status(500).send({ message: 'Add Member Fail, try again' });
  }
});

exports.getChannelData = getChannelData;
exports.createChannel = createChannel;
exports.inviteUserInThisChannel = inviteUserInThisChannel;
exports.leaveThisChannel = leaveThisChannel;
exports.addMember = addMember;
