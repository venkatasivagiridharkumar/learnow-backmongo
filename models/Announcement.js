const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  duration: String,
  time: String,
  link: String
});

module.exports = mongoose.model("Announcement", AnnouncementSchema);
