const HttpError = require("../handlers/http-error");

/*
  현재 user가 login상태인지 확인
  jwtMiddleware에서 token 해체한걸 req.payload에 담아서 비교에 사용한다
  middleware
 */
const checkLoggedIn = (req, res, next) => {
  if (!req.payload) {
    return next(new HttpError("You are not Login! Plase login again", 401)); //  Unauthorized
  }
  return next();
};

module.exports = checkLoggedIn;
