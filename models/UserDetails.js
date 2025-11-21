const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
  username: String,
  full_name: String,
  address: String,
  phone: String,
  photo: String,
  highest_study: String,
  college: String,
  graduation_year: Number,
  expertise: String
});

module.exports = mongoose.model("UserDetails", UserDetailsSchema);
