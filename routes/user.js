const userRouter = require('express').Router();
const userController = require('../controllers/userController');

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.patch(
  '/update/:id',
  userController.checkOwnId,
  userController.update,
);
userRouter.post('/logout', userController.logout);
userRouter.get('/:id', userController.getUserDoc); //get single user
userRouter.post('/:id/uploadPortrait',userController.uploadPortrait)
// userRouter.get("/", catchErrors(userController.userList));   // 미완

const errorHandlers = require('../handlers/errorHandlers');

// router.get('/',userController.getUsers); //get All user
// router.post('/signup',userController.signup); //get single user
// router.post('/login',userController.login);
// router.get('/:id',userController.getUserDoc);

module.exports = userRouter;
