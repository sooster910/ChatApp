const mongoose = require("mongoose");
const User = mongoose.model("User");
const Joi = require("joi");
const sha256 = require("js-sha256");
const { uuid } = require("uuidv4");
const { validationResult } = require("express-validator");
const { asyncMiddleware } = require("../utils/async");
const HttpError = require("../handlers/http-error");

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
    return new HttpError(result.error, 422);
    // return res.json({ message: result.error });
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    // email이 이미 존재하는지 검증
    const exists = await User.findByEmail(email);
    if (exists) {
      return new HttpError("User exist already, please login instead", 422);
    }
  } catch (err) {
    return new HttpError(
      "Sign up failed, internal Error, please try again",
      500
    );
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
    const error = new HttpError(
      "Signing up failed because of internal error, please try again",
      500
    );
  }

  // password는 리턴 정보에서 제외
  res.status(201).json({
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
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required().min(6),
  });

  const result = schema.validate(req.body);

  if (result.error) {
    return new HttpError(result.error, 422);
  }

  const { email, password } = req.body;

  try {
    // email 먼저 체크 후 checkpassowrd method로 비밀번호 검증
    const user = await User.findByEmail(email);
    if (!user) {
      return new HttpError("Email and Password did not match.", 401);
    }
    // user의 method를 사용해 비밀번호 검증
    const passCheck = await user.checkPassword(password);
    if (!passCheck) {
      return new HttpError("Email and Password did not match.", 401);
    }
    // 토큰 발급
    const token = user.generateToken();
    res.cookie("access_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 3, // 3day
      httpOnly: true,
    });
  } catch (err) {
    return new HttpError("Login failed, internal Error, please try again", 500);
  }

  res.status(200).json({
    message: "login sucess",
  });
});

/*
  PATCH /user/update:id
  {
    firstname: 'new firstname',
    lastname: 'new lastname',
    email: '??',
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
      return new HttpError("Not Found User", 404);
    }
  } catch (err) {
    return new HttpError(
      "Failed to edit, internal Error, please try again",
      500
    );
  }

  res.status(200).json({
    message: "Edit completed!",
  });
});

/*
  GET /user/check
  로그인 상태인지 확인
  안 쓰일 것 같다(중복도 많아서 지울지 고민)
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
  수정 권한이 있는지 확인용 미들웨어 
  현재는 본인인지 확인만
  토큰 id vs params의 id
  추후에 params로 보내는 id 값을 암호화 하게 되면 이부분도 수정해야함
 */
const checkOwnId = async (req, res, next) => {
  const { user } = req.payload;
  const { id } = req.params;
  if (user._id !== id.toString()) {
    return next(new HttpError("You have no authority", 403));
  }
  return next();
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

    // res도 try안에서 처리
    res.status(200).json({ userDoc: userDoc.userdataExcludingPassword() });
  } catch (err) {
    return new HttpError(
      "Get user fail, internal Error, please try again",
      500
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

const getUsers = (req, res) => {
  res.json({ users: DUMMY_USERS });
};

// const getUserDoc = asyncMiddleware(async (req, res) => {
//   const userId = req.params.id;
//   const userDoc = await DUMMY_USERS.find((user) => userId === user.id);
//   if (!userDoc)
//     return res
//       .status(404)
//       .json({ message: `could not find such user doc:${userId}` });

//   res.json({ userDoc });
// });

exports.signup = signup;
exports.login = login;
exports.update = update;
exports.check = check;
exports.logout = logout;
exports.checkOwnId = checkOwnId;
exports.getUserDoc = getUserDoc;
exports.userList = userList;
