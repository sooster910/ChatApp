const mongoose = require("mongoose");
const Chatroom = mongoose.model("Chatroom");
const Joi = require("joi");

/*
    GET /chatroom
 */
const getAllChatrooms = async (req, res, next) => {
  const chatrooms = await Chatroom.find({});

  res.json(chatrooms);
};

/*
    POST /chatroom
 */
const createChatroom = async (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .pattern(new RegExp(/^[A-Za-z\s]+$/))
      .required(),
  });

  const result = schema.validate(req.body);

  // validate error
  if (result.error) {
    res.status(400).json({ message: result.error });
    return;
  }

  const { name } = req.body;

  const chatroom = new Chatroom({
    name,
    createdBy: {
      _id: req.payload.user._id,
    },
  });
  await chatroom.save();

  res.status(201).json({
    name,
    message: "Create New ChatRoom!",
  });
};

exports.createChatroom = createChatroom;
exports.getAllChatrooms = getAllChatrooms;
