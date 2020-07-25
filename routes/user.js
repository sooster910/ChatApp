const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const { catchErrors } = require("../handlers/errorHandlers");

// router.get("/", userController.getUsers);
userRouter.post("/signup", catchErrors(userController.signup));
userRouter.post("/login", catchErrors(userController.login));
userRouter.patch("/update/:id", catchErrors(userController.update));

module.exports = userRouter;
