const mongoose = require('mongoose');
const User = mongoose.model('User');
const Joi = require('joi');
const { asyncMiddleware } = require('../utils/async');

/*
  POST /auth/signup
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
    POST /auth/login
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

    console.log(user);

    res.status(200).json({
      message: 'login sucess',
      user: user._id,
      token: token,
      io: user.currentChannel,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: 'Login failed, internal Error, please try again' });
  }
});

/*
  POST /auth/logout
 */
const logout = async (req, res, next) => {
  // 정보가 있던 token을 빈 token으로 바꿔버림
  res.cookie('access_token');
  res.status(204).send(); // No Content
};

/*
  GET /auth/check
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

exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.check = check;
