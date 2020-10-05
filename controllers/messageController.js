const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const Joi = require('joi');
const moment = require('moment');
const { asyncMiddleware } = require('../utils/async');
const HttpError = require('../handlers/http-error');

/*
  GET /message/:chatroomId
 */
const getMessageThisChatroom = asyncMiddleware(async (req, res, next) => {
  const chatroomId = req.params.chatroomId;

  try {
    const messages = await Message.find({
      chatroom: chatroomId,
    })
      .populate({
        path: 'user',
        select: 'firstname lastname userImgUrl',
      })
      .select('-_id user message createdAt')
      .sort({ _id: -1 })
      .limit(30)
      .lean()
      .exec();

    // 반환시 reverse로 뒤집어줌
    res.status(200).json(
      messages.reverse().map((message) => ({
        message: message.message,
        name: `${message.user.firstname} ${message.user.lastname}`,
        userId: message.user._id,
        userImgUrl:message.user.userImgUrl,
        createdAt: moment(message.createdAt).format('YYYY MM DD hh:mm:ss'),
      })),
    );
  } catch (err) {
    console.log(err);
    return new HttpError('getMessage Fail', 500);
  }
});

exports.getMessageThisChatroom = getMessageThisChatroom;
