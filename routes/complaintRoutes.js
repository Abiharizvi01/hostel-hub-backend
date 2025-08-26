import express from 'express';
const router = express.Router();
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaintStatus,
} from '../controllers/complaintController.js';
import { protect, warden } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// The order of middleware in the .post() route is changed here
router
  .route('/')
  .post(upload.single('image'), protect, createComplaint)
  .get(protect, warden, getAllComplaints);

// Students can see their own complaints
router.route('/mycomplaints').get(protect, getMyComplaints);

// Wardens can update a complaint's status
router.route('/:id').put(protect, warden, updateComplaintStatus);

export default router;