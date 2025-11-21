const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  mentor_username: String
});

module.exports = mongoose.model("User", UserSchema);
