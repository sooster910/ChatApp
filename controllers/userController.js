const mongoose = require('mongoose');
const User = mongoose.model('User');
const Joi = require('joi');
const { asyncMiddleware } = require('../utils/async');
const HttpError = require('../handlers/http-error');

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

/*
  GET /user/channelList
 */
const getChannelListLoginUser = asyncMiddleware(async (req, res, next) => {
  try {
    const channelList = await User.findById({
      _id: req.payload._id,
    })
      .populate({
        path: 'subscribedChannel',
        select: 'name',
      })
      .exec();

    res.status(200).json({
      channelList: {
        channelId: channelList._id,
        channelName: channelList.name,
      },
    });
  } catch (err) {
    return res.status(500).send({ message: 'get channel List Fail' });
  }
});

/*
  GET /user/wait
 */
// const getWaitingChannel = asyncMiddleware(async (req, res, next) => {});

exports.update = update;
exports.checkOwnId = checkOwnId;
exports.getUserDoc = getUserDoc;
exports.userList = userList;
exports.getChannelListLoginUser = getChannelListLoginUser;
