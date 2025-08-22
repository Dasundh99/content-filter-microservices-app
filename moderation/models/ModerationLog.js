const mongoose = require('mongoose');

const moderationSchema = new mongoose.Schema({
  commentId: String,
  postId: String,
  content: String,
  status: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ModerationLog', moderationSchema);
