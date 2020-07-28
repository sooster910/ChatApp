const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const { catchErrors } = require("../handlers/errorHandlers");

// router.get("/", userController.getUsers);
userRouter.post("/signup", catchErrors(userController.signup));
userRouter.post("/login", catchErrors(userController.login));
userRouter.patch("/update/:id", catchErrors(userController.update));
userRouter.get("/check", catchErrors(userController.check));
userRouter.post("/logout", catchErrors(userController.logout));
userRouter.get("/:id", catchErrors(userController.getUserDoc));
userRouter.get("/", catchErrors(userController.userList));

const errorHandlers = require("../handlers/errorHandlers");
userRouter.use(errorHandlers.notFound);
userRouter.use(errorHandlers.mongoseErrors);

module.exports = userRouter;
