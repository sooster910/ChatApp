const mongoose = require("mongoose");

const chatroomSchema =  new mongoose.Schema({
    name:{
    type: String,
    required:'name is required',
    },
  

})

module.exports = mongoose.model("chatroom", chatroomSchema);

