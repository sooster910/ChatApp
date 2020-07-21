const mongoose =require('mongoose');
const User = mongoose.model("User");
const sha256 = require('js-sha-256');
const uuid = require('uuid/v4');

exports.register= async(req,res) => {
    const {name, email,password } = req.body;
    const emailRegex =  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!emailRegex.test(email)){
        throw "your email is not valid. Please type valid email again";
    }
    if(password.length < 6){
        throw "Password must be at least 6 characters long"
    }
    const user = new User({name, email, password : sha256(password)});

    await user.save();


}
const DUMMY_USERS = [
    {id:'u1', name:'hyunsu', email:'test@test.com', password:'test'}

]
const getUsers = (req,res,next)=>{
    res.json({users:DUMMY_USERS})

}

const signup = (req,res,next)=>{
    const {name, email,password} = req.body;
    const createdUser = {
        id:uuid(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user:createdUser})
}
const login = (req,res,next)=>{
    const {email, password} = req.body;
    
}
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;