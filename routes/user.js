
const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const { catchErrors } = require("../handlers/errorHandlers");

// router.get("/", userController.getUsers);
userRouter.post("/signup", catchErrors(userController.signup));
userRouter.post("/login", catchErrors(userController.login));
userRouter.patch("/update/:id", catchErrors(userController.update));
userRouter.get("/check", catchErrors(userController.check)); //check currently logging with token
userRouter.post("/logout", catchErrors(userController.logout));
userRouter.get("/:id", catchErrors(userController.getUserDoc)); //get single user
userRouter.get("/", catchErrors(userController.userList));

const errorHandlers = require("../handlers/errorHandlers");
userRouter.use(errorHandlers.notFound);
userRouter.use(errorHandlers.mongoseErrors);

// const router = require('express').Router();
// const userController = require('../controllers/userController');
// const {catchErrors} = require('../handlers/errorHandlers');
// const {asyncMiddleware} = require('../utils/async');


// router.get('/',userController.getUsers); //get All user
// router.post('/signup',userController.signup); //get single user
// router.post('/login',userController.login);
// router.get('/:id',userController.getUserDoc);



module.exports = router;

