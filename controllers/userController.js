
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Joi = require("joi");
const sha256 = require('js-sha256');
const {uuid} = require('uuidv4');
const { validationResult } = require('express-validator');
const {asyncMiddleware} = require('../utils/async');
const HttpError = require('../handlers/http-error');
// const User = require('../models/User');
/*
  POST /user/signup
  {
      firstname: 'name',
      lastname: 'lastname',
      email: 'email',
      password: 'password',
  }
 */
const signup = async (req, res, next) => {
  // req body 검증
  const schema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))(?=.{8,})"))
      .required(),
  });

  const result = schema.validate(req.body);

  // 검증 실패시 에러 처리
  if (result.error) {
    res.status(400).json({ message: result.error });
    return;
  }

  const { firstname, lastname, email, password } = req.body;

  // email이 이미 존재하는지 검증
  const exists = await User.findByEmail(email);
  if (exists) {
    res
      .status(409)
      .json({ message: "User exist already,please login instead" });
    return;
  }

  const user = new User({
    firstname,
    lastname,
    email,
  });
  await user.setPassword(password);
  await user.save();

  res.status(201).json({
    firstname,
    lastname,
    email,
  });
};

/*
  POST /user/login
  {
      email: 'email',
      password: 'password',
  }
 */
const login = async (req, res, next) => {
  // req 검증
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required().min(6),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json({ message: result.error });
    return;
  }

  const { email, password } = req.body;

  // email 먼저 체크 후 checkpassowrd method로 비밀번호 검증
  const user = await User.findByEmail(email);
  if (!user) {
    res.status(401).json({ message: "Email and Password did not match." });
    return;
  }
  const passCheck = await user.checkPassword(password);
  if (!passCheck) {
    res.status(401).json({ message: "Email and Password did not match." });
    return;
  }

  // 토큰 발급
  const token = user.generateToken();
  res.cookie("access_token", token, {
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3day
    httpOnly: true,
  });

  res.status(200).json({
    message: "login sucess",
  });
};

// 비밀번호 검증은 언제 하지?
/*
  PATCH /user/update:id  //id? email?
  {
    firstname: 'new firstname',
    lastname: 'new lastname',
    email: '??',
  }
 */
const update = async (req, res, next) => {
  // req 검증 but not required
  const schema = Joi.object().keys({
    firstname: Joi.string(),
    lastname: Joi.string(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().required().min(6),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).json({ message: result.error });
    return;
  }

  const { id } = req.params;
  const newData = { ...req.body };

  const user = await User.findByIdAndUpdate(id, newData, {
    new: true,
  }).exec();

  if (!user) {
    res.status(400).json({ message: "updateFail" });
    return;
  }

  res.status(200).json({
    message: "modify success",
  });
};

/*
  GET /user/check
  로그인 상태인지 확인
 */
const check = async (req, res, next) => {
  const user = req.payload;
  if (!user) {
    res.status(401).send(); // Unauthorized
    return;
  }
  res.json({
    user: {
      ...user.user,
    },
  });
};

/*
  POST /user/logout
 */
const logout = async (req, res, next) => {
  // 정보가 있던 token을 빈 token으로 바꿔버림
  res.cookie("access_token");
  res.status(204).send(); // No Content
};

/*
  GET /user/:id
 */
const getUserDoc = async (req, res, next) => {
  const userId = req.params.id;
  const userDoc = await User.findById(userId);
  if (!userDoc) {
    res.status(404).json({ message: `could not find such user doc` });
    return;
  }

  res.json({ userDoc: userDoc.userdataExcludingPassword() });
};

// 아직..
/*
  GET /user/userList?firstname=&lastname=&email=
 */
const userList = async (req, res, next) => {
  // 페이징이 필요한가?
  const { firstname, lastname, email } = req.query;

  // 값이 들어온 경우에만 query에 세팅
  const query = {
    ...(firstname ? { firstname: firstname } : {}),
    ...(lastname ? { lastname: lastname } : {}),
    ...(email ? { email: email } : {}),
  };

  const users = await User.find(query).sort().limit(20).lean().exec();
  res.json({ users });
};


const DUMMY_USERS = [
    { id: 'u1', fname: 'hyunsu', lname: 'joo', email: 'test@test.com', password: 'test' }

]
const getUsers = (req, res) => {
    res.json({ users: DUMMY_USERS })
}

const signup = asyncMiddleware(async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return new HttpError('Invalid inputs passed, please check your data ', 422)
    }
      const { fname, lname, email, password } = req.body;
    //check existing user
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
        if (existingUser) {
        const error = new HttpError('User exist already,please login instead', 422);
        return error;
    }
    } catch (err) {
        const error = new HttpError(
            'Sign up failed, internal Error, please try again', 500
        );
        return error;
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


});

const login = asyncMiddleware((req, res) => {
    const { email, password } = req.body;

});

const getUserDoc = asyncMiddleware(async (req, res) => {
    const userId = req.params.id;
    const userDoc = await DUMMY_USERS.find(user => userId === user.id);
    if (!userDoc)
        return res.status(404).json({ message: `could not find such user doc:${userId}` })

    res.json({ userDoc })
});

exports.signup = signup;
exports.login = login;
exports.update = update;
exports.check = check;
exports.logout = logout;
exports.getUserDoc = getUserDoc;
exports.userList = userList;

