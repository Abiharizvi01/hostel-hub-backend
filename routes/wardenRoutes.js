import express from 'express';
const router = express.Router();
import { addToWhitelist, getWhitelist } from '../controllers/wardenController.js';
import { protect, warden } from '../middleware/authMiddleware.js';

// All routes in this file are protected and for wardens only
router.use(protect, warden);

// Get the whitelist & add a new student to it
router.route('/whitelist').get(getWhitelist).post(addToWhitelist);

export default router;