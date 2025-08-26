import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// --- CREATE, GET ALL, GET BY ID, CREATE COMMENT (No changes here) ---

export const createPost = async (req, res) => {
  const { title, text, flair } = req.body;
  try {
    const post = new Post({
      title,
      text,
      flair,
      user: req.user._id,
    });
    const createdPost = await post.save();
    res.status(201).json(createdPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' },
      });
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createPostComment = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      const comment = new Comment({
        text,
        user: req.user._id,
        post: post._id,
      });
      const createdComment = await comment.save();
      post.comments.push(createdComment);
      await post.save();
      res.status(201).json({ message: 'Comment added' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- REVISED VOTING LOGIC ---

export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    if (hasUpvoted) {
      // User is toggling their upvote off
      post.upvotes.pull(userId);
    } else {
      // User is adding a new upvote
      post.upvotes.push(userId);
      // If they had previously downvoted, remove their downvote
      if (hasDownvoted) {
        post.downvotes.pull(userId);
      }
    }

    await post.save();
    // Return the updated, populated post so clients can refresh their cache precisely
    const updated = await Post.findById(post._id).populate('user', 'name');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const downvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = post.upvotes.includes(userId);
    const hasDownvoted = post.downvotes.includes(userId);

    if (hasDownvoted) {
      // User is toggling their downvote off
      post.downvotes.pull(userId);
    } else {
      // User is adding a new downvote
      post.downvotes.push(userId);
      // If they had previously upvoted, remove their upvote
      if (hasUpvoted) {
        post.upvotes.pull(userId);
      }
    }
    
    await post.save();
    // Return the updated, populated post so clients can refresh their cache precisely
    const updated = await Post.findById(post._id).populate('user', 'name');
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};