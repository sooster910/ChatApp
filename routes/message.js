const messageRouter = require('express').Router();
const messageController = require('../controllers/messageController');
const checkLoggedIn = require('../lib/checkLoggedIn');

messageRouter.get(
  '/:chatroomId',
  checkLoggedIn,
  messageController.getMessageThisChatroom,
);

module.exports = messageRouter;
