const mongoose = require("mongoose");

const messageSchema =  new mongoose.Schema({
    chatroom:{
    type: mongoose.Schema.Types.ObjectId,
    required:'chatroom is required',
    ref:"Chatroom"
    },
    user:{
        type:mongoose.Schema.type.ObjectId,
        required:"chatroom is required",
        ref:"User"
    },
    message:{
        type:String,
        required:"Message is required"
    }
  

})

module.exports = mongoose.model("Message", messageSchema);

