import express from 'express';
const router = express.Router();
import {
  createPost,
  getAllPosts,
  getPostById,
  createPostComment,
  upvotePost,
  downvotePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

// Get all posts & create a new post
router.route('/').get(getAllPosts).post(protect, createPost);

// Get a single post by its ID
router.route('/:id').get(getPostById);

// Create a comment on a post
router.route('/:id/comments').post(protect, createPostComment);

// Upvote and downvote a post
router.route('/:id/upvote').put(protect, upvotePost);
router.route('/:id/downvote').put(protect, downvotePost);

export default router;