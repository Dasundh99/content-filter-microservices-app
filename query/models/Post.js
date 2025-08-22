const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  id: String,
  content: String,
  status: String,
});

const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  comments: [commentSchema],
});

module.exports = mongoose.model("QueryPost", postSchema);
