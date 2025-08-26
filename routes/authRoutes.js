import express from 'express';
const router = express.Router();
import { registerUser, loginUser,logoutUser, } from '../controllers/authController.js';

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

router.post('/logout', logoutUser); // 2. Add this new route

export default router;