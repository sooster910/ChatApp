const mongoose = require("mongoose");
const mongoSchema = mongoose.Schema;

const chatroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "name is required",
  },
  createdBy: {
    _id: mongoSchema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chatroom", chatroomSchema);
