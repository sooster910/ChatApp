/*
  현재 user가 login상태인지 확인
  middleware 사용하듯 쓰면 됨
 */
const checkLoggedIn = (req, res, next) => {
  if (!req.payload) {
    res.status(401).send(); // Unauthorized
    return;
  }
  return next();
};

module.exports = checkLoggedIn;
