const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  company: String,
  role: String,
  link: String,
  ctc: String,
  description: String,
  technologies: String,
  location: String,
  last_date: String
});

module.exports = mongoose.model("Job", JobSchema);
