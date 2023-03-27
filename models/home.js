const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video-controller');

router.get('/', videoController.getVideos);
router.post('/search', videoController.searchVideos);

module.exports = router;
