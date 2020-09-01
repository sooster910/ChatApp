const { Router } = require('express');
const userController = require('../controllers/userController');
const checkLoggedIn = require('../lib/checkLoggedIn');

const user = new Router();

user.patch('/update/:id', userController.checkOwnId, userController.update);
user.get('/:id', userController.getUserDoc); //get single user
user.get('/channelList', userController.getChannelListLoginUser);
// 보류

const userRouter = new Router();

// userRouter 전체에 checkLoggedIn 적용
userRouter.use('/', checkLoggedIn, user);

module.exports = userRouter;
