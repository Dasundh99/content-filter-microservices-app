const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  id: String,   // keep randomBytes ID
  title: String,
});

module.exports = mongoose.model("Post", postSchema);
