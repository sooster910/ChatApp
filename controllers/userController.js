const mongoose = require('mongoose');
const sha256 = require('js-sha256');
const {uuid} = require('uuidv4');
const { validationResult } = require('express-validator');
const HttpError = require('../handlers/http-error');
const User = require('../models/User');

//  comment for now! will be used for validation 
// exports.register = async (req, res) => {
//     const { name, email, password } = req.body;
//     const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//     if (!emailRegex.test(email)) {
//         throw "your email is not valid. Please type valid email again";
//     }
//     if (password.length < 6) {
//         throw "Password must be at least 6 characters long"
//     }
//     const user = new User({ name, email, password: sha256(password) });

//     await user.save();


//}
const DUMMY_USERS = [
    { id: 'u1', fname: 'hyunsu', lname: 'joo', email: 'test@test.com', password: 'test' }

]
const getUsers = (req, res) => {
    res.json({ users: DUMMY_USERS })
}

const signup = async (req, res, next) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data ', 422))
    }
      const { fname, lname, email, password } = req.body;
    //check existing user
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
        if (existingUser) {
        const error = new HttpError('User exist already,please login instead', 422);
        return next(error);
    }
    } catch (err) {
        const error = new HttpError(
            'Sign up failed, internal Error, please try again', 500
        );
        return next(error);
    }


    //TODO: HASH PASSWORD
    const newUser = new User({
        id:uuid(),
        fname,
        lname,
        email,
        password
    })

    try {
        await newUser.save();

    } catch (err) {
        const error = new HttpError('Signing up failed because of internal error, please try again', 500);
        return next(error);
    }

    res.status(201).json({ user: newUser.toObject({ getter: true }) });


}

const login = (req, res, next) => {
    const { email, password } = req.body;

}

const getUserDoc = async (req, res, next) => {
    const userId = req.params.id;
    const userDoc = await DUMMY_USERS.find(user => userId === user.id);
    if (!userDoc)
        return res.status(404).json({ message: `could not find such user doc:${userId}` })

    res.json({ userDoc })
}
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserDoc = getUserDoc;