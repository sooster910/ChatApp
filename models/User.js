const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
    name:{
    type: String,
    required:'name is required',
    },
    email:{
        type:String,
        required:'email is required',
        unique:true, //increase querying
    },
    password:{
        type:String,
        required:'password is required',
        minlength:6,
    },
    image:{type:String, required :'profile Image is required'},

    timestamps : true,

})

module.exports = mongoose.model("User", userSchema);

