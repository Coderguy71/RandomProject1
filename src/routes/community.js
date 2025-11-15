const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const communityController = require('../controllers/communityController');

router.post('/posts', authenticate, communityController.createPost);
router.get('/posts', authenticate, communityController.getPosts);
router.get('/posts/:id', authenticate, communityController.getPostById);
router.put('/posts/:id', authenticate, communityController.updatePost);
router.delete('/posts/:id', authenticate, communityController.deletePost);

router.post('/posts/:id/replies', authenticate, communityController.createReply);
router.put('/replies/:id', authenticate, communityController.updateReply);
router.delete('/replies/:id', authenticate, communityController.deleteReply);

router.get('/trending', authenticate, communityController.getTrendingPosts);

module.exports = router;
