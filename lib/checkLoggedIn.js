const jwt = require('jsonwebtoken');
const HttpError = require('../handlers/http-error');

/*
  현재 user가 login상태인지 확인
 */
const checkLoggedIn = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw 'Forbidden!!';
    const token = req.headers.authorization.split(' ')[1];
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    req.payload = payload;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Forbidden',
    });
    // next(new HttpError('Forbidden Error', 401));
  }
};

module.exports = checkLoggedIn;
