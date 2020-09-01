require("dotenv").config();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Joi = require('joi');
const { uuid } = require('uuidv4');
const { validationResult } = require('express-validator');
const { asyncMiddleware } = require('../utils/async');
const HttpError = require('../handlers/http-error');
const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3') 
aws.config.update(process.env.awsConfig)
const s3 = new aws.s3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'some-bucket',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})
/*
  POST /user/signup
  {
      firstname: 'name',
      lastname: 'lastname',
      email: 'email',
      password: 'password',
  }
 */
const signup = asyncMiddleware(async (req, res, next) => {
  // req body 검증
  const schema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string()
      .pattern(new RegExp('^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))(?=.{8,})'))
      .required(),
  });

  const result = schema.validate(req.body);

  // 검증 실패시 에러 처리
  if (result.error) {
    // return new HttpError(result.error, 422);
    return res.status(422).send({ message: result.error.message });
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    // email이 이미 존재하는지 검증
    const exists = await User.findByEmail(email);
    if (exists) {
      return res
        .status(422)
        .send({ message: 'User exist already, please login instead' });
      // return new HttpError('User exist already, please login instead', 422);
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Sign up failed, internal Error, please try again' });
  }

  const user = new User({
    firstname,
    lastname,
    email,
  });

  try {
   await user.setPassword(password);
    await user.save();
  } catch (err) {
    return res.status(500).send({
      message: 'Signing up failed because of internal error, please try again',
    });
  }

  // password는 리턴 정보에서 제외
  res.status(201).json({
    message: `${firstname} ${lastname} signup success`,
    firstname,
    lastname,
    email,
  });
});

/*
  POST /user/login
  {
      email: 'email',
      password: 'password',
  }
 */
const login = asyncMiddleware(async (req, res, next) => {
  // req 검증
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string().required().min(6),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return res.status(422).send({ message: result.error.message });
  }

  const { email, password } = req.body;

  try {
    // email 먼저 체크 후 checkpassowrd method로 비밀번호 검증
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(401)
        .send({ message: 'Email and Password did not match.' });
    }
    // user의 method를 사용해 비밀번호 검증
    const passCheck = await user.checkPassword(password);
    if (!passCheck) {
      return res
        .status(401)
        .send({ message: 'Email and Password did not match.' });
    }
    // 토큰 발급
    const token = user.generateToken();
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3day
      httpOnly: true,
    });

    res.status(200).json({
      message: 'login sucess',
      user: user._id,
      token: token,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Login failed, internal Error, please try again' });
  }
});

/*
  PATCH /user/update:id
  {
    firstname: 'new firstname',
    lastname: 'new lastname',
  }
 */
const update = asyncMiddleware(async (req, res, next) => {
  // req 검증 but not required
  const schema = Joi.object().keys({
    firstname: Joi.string(),
    lastname: Joi.string(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    return new HttpError(result.error, 422);
  }

  const { id } = req.params;
  const newData = { ...req.body };

  try {
    const user = await User.findByIdAndUpdate(id, newData, {
      new: true,
    }).exec();

    if (!user) {
      return new HttpError('Not Found User', 404);
    }
  } catch (err) {
    return new HttpError(
      'Failed to edit, internal Error, please try again',
      500,
    );
  }

  // 수정한 정보로 새로운 토큰 반환
  const token = user.generateToken();
  res.cookie('access_token', token, {
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3day
    httpOnly: true,
  });

  res.status(200).json({
    message: 'Edit completed!',
    token: token,
  });
});

/*
  수정 권한이 있는지 확인용 미들웨어 
  현재는 본인인지 확인만
  토큰 id vs params의 id
  추후에 params로 보내는 id 값을 암호화 하게 되면 이부분도 수정해야함
 */
const checkOwnId = async (req, res, next) => {
  const { user } = req.payload;
  const { id } = req.params;
  if (user._id !== id.toString()) {
    return next(new HttpError('You have no authority', 403));
  }
  return next();
};

/*
  GET /user/check
 */
const check = async (req, res, next) => {
  const { user } = req.payload.user;
  console.log(user);
  if (!user) {
    return res.status(401).send();
  }
  res.json({
    user,
  });
};

/*
  POST /user/logout
 */
const logout = async (req, res, next) => {
  // 정보가 있던 token을 빈 token으로 바꿔버림
  res.cookie('access_token');
  res.status(204).send(); // No Content
};

/*
  GET /user/:id
  // _id의 length가 맞지 않으면 mongoose에서 id로 검색 자체를 해주지 않는다
  // req시 _id의 length를 확인해서 error처리하는 로직을 새로 짜야함
 */
const getUserDoc = asyncMiddleware(async (req, res, next) => {
  const userId = req.params.id;
  try {
    const userDoc = await User.findById(userId);

    if (!userDoc) {
      return new HttpError(`could not find such user doc`, 404);
    }

    res.status(200).json({ userDoc: userDoc.userdataExcludingPassword() });
  } catch (err) {
    return new HttpError(
      'Get user fail, internal Error, please try again',
      500,
    );
  }
});

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

const uploadPortrait = asyncMiddleware (async(req,qes) =>{
    //upload to s3

    //update info in db with url
    //send response to client
})
exports.signup = signup;
exports.login = login;
exports.update = update;
exports.logout = logout;
exports.check = check;
exports.checkOwnId = checkOwnId;
exports.getUserDoc = getUserDoc;
exports.userList = userList;
exports.uploadPortrait = uploadPortrait;
