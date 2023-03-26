// const express = require('express');
// const router = express.Router();
// const Video = require('../models/video');


// Subash Cretaed Neupane

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  channel: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  img: {
    type: String,
    required: true
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;




// Video page route
// router.get('/:id', (req, res) => {
//   Video.findById(req.params.id)
//     .then(video => {
//       res.render('video', { video });
//     })
//     .catch(err => console.log(err));
// });

// module.exports = router;
