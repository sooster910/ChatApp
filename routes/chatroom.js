const chatroomRouter = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const chatroomController = require("../controllers/chatroomController");
const checkLoggedIn = require("../lib/checkLoggedIn");

chatroomRouter.get(
  "/",
  checkLoggedIn,
  catchErrors(chatroomController.getAllChatrooms)
);
chatroomRouter.post(
  "/",
  checkLoggedIn,
  catchErrors(chatroomController.createChatroom)
);

const errorHandlers = require("../handlers/errorHandlers");
chatroomRouter.use(errorHandlers.notFound);
chatroomRouter.use(errorHandlers.mongoseErrors);

module.exports = chatroomRouter;
