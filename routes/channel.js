const { Router } = require('express');
const channelController = require('../controllers/channelController');
const userController = require('../controllers/userController');
const checkLoggedIn = require('../lib/checkLoggedIn');

const channel = new Router();

channel.get('/:id', channelController.getChannelData);
channel.post('/create', channelController.createChannel);
channel.post(
  '/invite',
  channelController.inviteUserInThisChannel,
  userController.waitingChannel,
);
channel.post(
  '/leave',
  channelController.leaveThisChannel,
  userController.leaveThisChannelLoiginUser,
);
// channel에 넣어주고 user에 체널 적어주기
channel.post('/join', channelController.addMember, userController.joinChannel);

const channelRouter = new Router();

// channelRouter 전체에 checkLoggedIn 적용
channelRouter.use('/', checkLoggedIn, channel);

module.exports = channelRouter;
