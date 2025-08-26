import Notice from '../models/Notice.js';

// @desc    Get all notices
// @route   GET /api/notices
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new notice (Warden only)
// @route   POST /api/notices
export const createNotice = async (req, res) => {
  const { title, content } = req.body;
  try {
    const notice = new Notice({
      title,
      content,
      user: req.user._id,
    });

    const createdNotice = await notice.save();
    res.status(201).json(createdNotice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};