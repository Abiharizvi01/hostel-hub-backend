import User from '../models/User.js';
import Whitelist from '../models/Whitelist.js';
import jwt from 'jsonwebtoken';

// THIS IS THE MISSING HELPER FUNCTION
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


// controllers/authController.js

export const registerUser = async (req, res) => {
  const { name, email, collegeId, password } = req.body;

  try {
    // 1. Check if the collegeId is on the pre-approved list
    const isApproved = await Whitelist.findOne({
      collegeId: collegeId.toUpperCase(),
    });
    if (!isApproved) {
      return res
        .status(403)
        .json({ message: 'This College ID is not authorized to register.' });
    }

    // 2. Check if the user/email/ID already exists
    const userExists = await User.findOne({ $or: [{ email }, { collegeId }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'User with this email or College ID already exists' });
    }

    // 3. Create the new user - role is automatically 'Student'
    const user = await User.create({
      name,
      email,
      collegeId,
      password,
      role: 'Student', // Role is hardcoded to 'Student' for security
    });

    if (user) {
      // Remove from the whitelist to prevent re-registration
      await Whitelist.deleteOne({ collegeId: collegeId.toUpperCase() });
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
export const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};