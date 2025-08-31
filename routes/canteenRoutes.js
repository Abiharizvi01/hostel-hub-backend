import express from 'express';
const router = express.Router();
import { getCanteenStatus, reportCanteenStatus } from '../controllers/canteenController.js';
import { protect } from '../middleware/authMiddleware.js';

// Anyone can get the status, but only a logged-in student can report it.

// 2. Add 'protect' middleware to the .post() route
router.route('/status').get(getCanteenStatus).post(protect, reportCanteenStatus);


export default router;