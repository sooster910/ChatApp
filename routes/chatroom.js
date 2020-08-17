const chatroomRouter = require('express').Router();
const chatroomController = require('../controllers/chatroomController');
const checkLoggedIn = require('../lib/checkLoggedIn');

// chatroomRouter.get('/', chatroomController.getAllChatrooms);
// chatroomRouter.post('/', checkLoggedIn, chatroomController.getChatrooms);

chatroomRouter.post('/', checkLoggedIn, chatroomController.createChatroom);
chatroomRouter.get('/', checkLoggedIn, chatroomController.getChatrooms);
chatroomRouter.get('/:id', checkLoggedIn, chatroomController.getChatroomData);

module.exports = chatroomRouter;
