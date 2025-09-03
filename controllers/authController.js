import User from '../models/user.js';
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

  // This is the new, crucial check
  if (!collegeId) {
    return res.status(400).json({ message: 'College ID is required.' });
  }

  try {
    const isApproved = await Whitelist.findOne({
      collegeId: collegeId.toUpperCase(),
    });
    if (!isApproved) {
      return res
        .status(403)
        .json({ message: 'This College ID is not authorized to register.' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { collegeId }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'User with this email or College ID already exists' });
    }

    const user = await User.create({
      name,
      email,
      collegeId,
      password,
      role: 'Student',
    });

    if (user) {
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