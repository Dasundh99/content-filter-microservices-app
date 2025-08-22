const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  id: String,          // keep your random id
  content: String,
  status: { type: String, default: 'pending' },
  postId: String,
});

module.exports = mongoose.model('Comment', commentSchema);
