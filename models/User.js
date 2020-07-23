const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
    image:{type:String, required :'profile Image is required'}


})


userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema);