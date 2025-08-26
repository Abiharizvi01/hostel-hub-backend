import Whitelist from '../models/Whitelist.js';

// @desc    Add a student to the whitelist
// @route   POST /api/warden/whitelist
export const addToWhitelist = async (req, res) => {
  const { name, collegeId } = req.body;
  try {
    const studentExists = await Whitelist.findOne({ collegeId: collegeId.toUpperCase() });
    if (studentExists) {
      return res.status(400).json({ message: 'Student is already on the whitelist.' });
    }
    const newStudent = await Whitelist.create({
      name,
      collegeId: collegeId.toUpperCase(),
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// @desc    Get the whitelist
// @route   GET /api/warden/whitelist
export const getWhitelist = async (req, res) => {
    try {
        const list = await Whitelist.find({});
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}