import express from 'express';
const router = express.Router();
import { getMenu, setMenu } from '../controllers/menuController.js';
import { protect, warden } from '../middleware/authMiddleware.js';

// Anyone can get the menu, but only a warden can set it.
router.route('/').get(getMenu).post(protect, warden, setMenu);

export default router;