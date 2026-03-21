// backend/routes/commentRoutes.js

const express = require('express');
const router  = express.Router();
const { toggleLike, getLikeStatus } = require('../controllers/commentController');

// Likes only
router.get( '/like/:blogId', getLikeStatus);
router.post('/like/:blogId', toggleLike);

module.exports = router;