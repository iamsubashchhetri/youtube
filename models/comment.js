const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  videoId: {
    type: Number,
  
    
    required: true
  },
  username: {
    type: String,
    required: true,
    trim:true,
  },
  text: {
    type: String,
    required: true,
    trim:true,
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;