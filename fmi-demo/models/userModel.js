const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
var JWT = require("./../middleware/jwt");

const UserSchema = new Schema({
  //id se pune automat
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  hashed_password: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
});

const user = mongoose.model("user", UserSchema);

function hashPW(pw) {
  return crypto.createHash("sha256").update(pw).digest("base64").toString();
}

exports.register = function (userReq) {
  let newUser = new user();

  newUser.set("email", userReq.email);
  newUser.set("name", userReq.name);
  newUser.set("hashed_password", hashPW(userReq.password));

  return new Promise((resolve, reject) => {
    newUser.save(function (err, insertedUser) {
      if (err) {
        // console.log(err);
        reject({ err });

      } else {
        resolve({ user: insertedUser });
      }
    });
  });
};

exports.login = function(userReq) {
  return new Promise((resolve, reject) => {
    user.findOne({ email: userReq.email }).exec(function(err, user) {
      if (err) {
        reject(err);
      }
      if (!user) {
        reject({ msg: "Auth failed" });
      } else if (user.hashed_password === hashPW(userReq.password.toString())) {
        var token = JWT.getToken({
          email: user.email,
          _id: user._id,
          username: user.username,
          admin: user.admin,
          _retailers: user._retailers
        });
        resolve({
          msg: "auth successfull",
          token: token,
          user: {
            name: user.name,
            email: user.email
          }
        });
      } else {
        reject({ msg: "Auth failed" });
      }
    });
  });
};
