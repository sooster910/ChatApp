const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const sha256 = require('js-sha256');

const userSchema = new Schema({
  firstname: {
    type: String,
    required: 'firstname is required',
  },
  lastname: {
    type: String,
    required: 'lastname is required',
  },
  email: {
    type: String,
    required: 'email is required',
    unique: true, //increase querying
  },
  password: {
    type: String,
    required: 'password is required',
  },
  image: { type: String },
  // 접속시 socketId 기록 / 여기서 socketId는 `/${namespace}#${socketId}`의 구조를 띄고 있다
  socketId: {
    type: String,
  },
  // 해당 user의 모든 요청마다 시간을 갱신해준다
  lastReqTime: {
    type: Date,
    default: Date.now,
  },
  // 현재 접속중인 Channel
  currentChannel: { _id: { type: Schema.Types.ObjectId, ref: 'Channel' } },
  // 구독중인 모든 channel
  subscribedChannel: [{ _id: { type: Schema.Types.ObjectId, ref: 'Channel' } }],
  // 초대 받은 channel 참가 시 삭제
  waitingChannel: [{ _id: { type: Schema.Types.ObjectId, ref: 'Channel' } }],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

// token 생성 메소드
userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      firstname: this.firstname,
      lastname: this.lastname,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '3d',
    },
  );
  return token;
};

// methods
userSchema.methods.setPassword = async function (password) {
  const pass = sha256(password + process.env.SALT);
  this.password = pass;
};

userSchema.methods.checkPassword = async function (password) {
  const result = sha256(password + process.env.SALT) === this.password;
  return result; // true or false
};

userSchema.methods.userdataExcludingPassword = function () {
  const data = this.toJSON();
  delete data.password;
  return data;
};

// static
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

userSchema.statics.findByName = function (query) {
  return this.find(query);
};

userSchema.statics.findByFirstName = function (firstname) {
  return this.find({ firstname: firstname });
};

userSchema.statics.findByLastName = function (lastname) {
  return this.find({ lastname: lastname });
};

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
