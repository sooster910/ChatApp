const mongoose = require('mongoose');
const Chatroom = mongoose.model('Chatroom');
const Joi = require('joi');
const { asyncMiddleware } = require('../utils/async');
const HttpError = require('../handlers/http-error');

/*
  GET /chatroom
 */
const getChatrooms = asyncMiddleware(async (req, res, next) => {
  // 접속 권한이 있는 Chatroom만 들고와야 한다.
  try {
    const chatrooms = await Chatroom.find({
      member: {
        $elemMatch: { _id: req.payload._id },
      },
    }).exec();
    res.status(200).json(chatrooms);
  } catch (err) {
    return res.status(500).send({ message: 'get chatrooms Fail' });
    // return new HttpError('fail', 500);
  }
});

/*
    POST /chatroom
    {
      "name": "new Chat Room!",
    }
 */
const createChatroom = asyncMiddleware(async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .pattern(new RegExp(/^[A-Za-z\s]+$/))
      .required(),
  });

  const result = schema.validate(req.body);

  // validate error
  if (result.error) {
    // return new HttpError(result.error, 400);
    return res.status(400).send({ message: result.error.message });
  }

  const { name } = req.body;

  const chatroom = new Chatroom({
    name,
    createdBy: req.payload._id,
    member: [
      {
        _id: req.payload._id,
      },
    ],
  });

  try {
    await chatroom.save();
  } catch (err) {
    return res
      .status(500)
      .send({
        message: 'Create ChatRoom Fail, internal Error, please try again',
      });
  }

  res.status(201).json({
    name,
    message: 'Create New ChatRoom!',
  });
});

const getChatroomData = asyncMiddleware(async (req, res, next) => {
  const chatroomId = req.params.id;
  try {
    const chatroomData = await Chatroom.findById(chatroomId);

    if (!chatroomData) {
      return res.status(404).send({ message: 'not fount chatroom' });
    }

    res.status(200).json({
      chatroomData,
    });
  } catch (err) {
    return res.status(500).send('GetChatroom Fail, please try again');
  }
});

/*

*/
const inviteRoom = async (req, res, next) => {
  // chat룸에 member에 넣어주자
};

exports.getChatrooms = getChatrooms;
exports.createChatroom = createChatroom;
exports.getChatroomData = getChatroomData;
