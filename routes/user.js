const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const checkLoggedIn = require('../lib/checkLoggedIn');
userRouter.get('/:id', userController.getUserDoc);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.patch('/update',  checkLoggedIn, userController.update);

userRouter.patch(
  '/update/:id',
  userController.checkOwnId,
  userController.update,
);
userRouter.post('/logout', userController.logout);

// userRouter.get("/", catchErrors(userController.userList));   // 미완
// userRouter.post('/profile/avatar',checkLoggedIn,userController.uploadPortrait);
userRouter.get('/profile/avatar',checkLoggedIn,userController.getPortrait);
userRouter.get('/profile/userImage', checkLoggedIn,userController.getUserImageFromS3)
// userRouter.patch('/profile',checkLoggedIn, userController.updateUserProfile);

 //get single user
const errorHandlers = require('../handlers/errorHandlers');


// router.get('/',userController.getUsers); //get All user
// router.post('/signup',userController.signup); //get single user
// router.post('/login',userController.login);
// router.get('/:id',userController.getUserDoc);

module.exports = userRouter;
