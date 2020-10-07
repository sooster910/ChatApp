const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtMiddleware = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.payload = {
      ...req.payload,
      user: {
        _id: decoded._id,
        firstname: decoded.firstname,
        lastname: decoded.lastname,
      
      },
    };
    // 토큰 유효기간 확인 후 재발급
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 1) {
      // 1day 이하로 남으면
      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 3, // 3day로 재발급
        httpOnly: true,
      });
    }
    return next();
  } catch (e) {
    return next();
  }
};

module.exports = jwtMiddleware;
