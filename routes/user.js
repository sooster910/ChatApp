const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const { catchErrors } = require("../handlers/errorHandlers");
const checkLoggedIn = require("../lib/checkLoggedIn");

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.patch(
  "/update/:id",
  checkLoggedIn,
  userController.checkOwnId,
  userController.update
);
userRouter.get("/check", catchErrors(userController.check)); //check currently logging with token
userRouter.post("/logout", userController.logout);
userRouter.get("/:id", userController.getUserDoc); //get single user
// userRouter.get("/", catchErrors(userController.userList));   // 미완

const errorHandlers = require("../handlers/errorHandlers");

// router.get('/',userController.getUsers); //get All user
// router.post('/signup',userController.signup); //get single user
// router.post('/login',userController.login);
// router.get('/:id',userController.getUserDoc);

module.exports = userRouter;
