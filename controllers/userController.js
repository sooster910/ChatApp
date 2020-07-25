const mongoose = require("mongoose");
const User = mongoose.model("User");
const Joi = require("joi");

/*
  POST /user/signup
  {
      firstname: 'name',
      lastname: 'lasname',
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
    password: Joi.string().required().min(6),
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
    res.status(409).json({ message: "This email already exists" });
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

  const user = await User.findByEmail(email);
  if (!user) {
    res.status(401).json({ message: "Not Found Email" });
    return;
  }

  const passCheck = await user.checkPassword(password);
  if (!passCheck) {
    res.status(401).json({ message: "Password Fail" });
    return;
  }

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
    password: 'new password',
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
  // 여기서 password 변경 로직 추가 해야 함

  const user = await User.findByIdAndUpdate(id, newData, {
    new: true,
  }).exec();

  if (!user) {
    res.status(400).json({ message: updateFail });
    return;
  }

  res.status(200).json({
    message: "modify success",
  });
};

exports.signup = signup;
exports.login = login;
exports.update = update;
