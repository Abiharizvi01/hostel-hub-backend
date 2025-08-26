import express from 'express';
const router = express.Router();
import { createNotice, getAllNotices } from '../controllers/noticeController.js';
import { protect, warden } from '../middleware/authMiddleware.js';

// Anyone can get notices, but only a warden can post one.
router.route('/').get(getAllNotices).post(protect, warden, createNotice);

export default router;