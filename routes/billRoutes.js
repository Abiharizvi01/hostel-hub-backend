import express from 'express';
const router = express.Router();
import {
  createBill,
  getAllBills,
  getMyBills,
  updateBillStatus,
} from '../controllers/billController.js';
import { protect, warden } from '../middleware/authMiddleware.js';

// Warden can create a bill or get all bills
router.route('/').post(protect, warden, createBill).get(protect, warden, getAllBills);

// Students can get their own bills
router.route('/mybills').get(protect, getMyBills);

// Warden can update a bill's status
router.route('/:id/status').put(protect, warden, updateBillStatus);

export default router;