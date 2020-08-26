const { Router } = require('express');
const channelController = require('../controllers/channelController');
const checkLoggedIn = require('../lib/checkLoggedIn');

const channel = new Router();

channel.get('/:id', channelController.getChannelData);
channel.post('/create', channelController.createChannel);
channel.post('/invite', channelController.inviteUserInThisChannel);

const channelRouter = new Router();

// channelRouter 전체에 checkLoggedIn 적용
channelRouter.use('/', checkLoggedIn, channel);

module.exports = channelRouter;
