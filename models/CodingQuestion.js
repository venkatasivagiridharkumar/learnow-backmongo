const mongoose = require("mongoose");

const CodingQuestionSchema = new mongoose.Schema({
  name: String,
  difficulty: String,
  link: String
});

module.exports = mongoose.model("CodingQuestion", CodingQuestionSchema);
