const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  username: String,
  name: String,
  phone: String,
  photo: String,
  expertise: String,
  experience: String,
  bio: String,
  linkedin: String
});
module.exports = mongoose.model("Mentor", MentorSchema);
