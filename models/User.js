const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");
const sha256 = require("js-sha256");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: "firstname is required",
  },
  lastname: {
    type: String,
    required: "lastname is required",
  },
  email: {
    type: String,
    required: "email is required",
    unique: true, //increase querying
  },
  password: {
    type: String,
    required: "password is required",
  },
  image: { type: String },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdateDate: {
    type: Date,
    default: Date.now,
  },
});

// token 생성 메소드
userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    {
      _id: this.id,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
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

module.exports = mongoose.model("User", userSchema);
