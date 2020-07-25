const mongoose = require("mongoose");
const mongoSchema = mongoose.Schema;
const messageSchema = new mongoSchema({
  chatroom: {
    type: mongoSchema.Types.ObjectId,
    required: "chatroom is required",
    ref: "Chatroom",
  },
  user: {
    type: mongoSchema.Types.ObjectId,
    required: "chatroom is required",
    ref: "User",
  },
  message: {
    type: String,
    required: "Message is required",
  },
});

module.exports = mongoose.model("Message", messageSchema);
