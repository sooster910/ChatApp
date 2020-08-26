const { Router } = require('express');
const userController = require('../controllers/userController');

const userRouter = new Router();

userRouter.patch(
  '/update/:id',
  userController.checkOwnId,
  userController.update,
);
userRouter.get('/:id', userController.getUserDoc); //get single user
userRouter.get('/channelList', userController.getChannelListLoginUser);
// userRouter.get("/", catchErrors(userController.userList));   // 미완

// router.get('/',userController.getUsers); //get All user
// router.post('/signup',userController.signup); //get single user
// router.post('/login',userController.login);
// router.get('/:id',userController.getUserDoc);

module.exports = userRouter;
